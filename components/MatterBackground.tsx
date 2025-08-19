'use client'

import {useEffect, useMemo, useRef} from 'react'

export default function MatterBackground() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const computeScale = (W: number) =>
    W <= 360 ? 0.4 : W <= 480 ? 0.55 : W <= 640 ? 0.7 : W <= 768 ? 0.85 : 1

  let MAX_RADIUS = 120

  useEffect(() => {
    if (prefersReduced) return

    // Matter modules
    let Engine: any,
      Render: any,
      Runner: any,
      Bodies: any,
      Composite: any,
      Events: any,
      World: any,
      Body: any
    // Instances
    let engine: any, render: any, runner: any
    let leftWall: any, rightWall: any, floor: any
    let spawnTimer: any
    let disposed = false

    // --- Tuning ---
    const START_COLOR = '#CCCCCC'
    const MERGED_COLOR = '#1B2730'
    const SIDES = 5 // pentagon
    const AIR = 0.03
    const REST = 0.35
    const GRAVITY_Y = 0.05
    const MAX_BODIES = 120
    const SPAWN_EVERY_MS = 600

    // Global wind (kept small so motion is NOT uniform)
    const WIND_MAX = 0.00005
    const WIND_CHANGE_MS = 1500
    const WIND_LERP = 0.02
    const JITTER = 0.00005

    // Per-body drifting (+ tiny torque) for “spacey” feel
    const DRIFT_FORCE = 0.00003
    const DRIFT_SPEED_MIN = 0.001
    const DRIFT_SPEED_MAX = 0.003
    const SPIN_BIAS_MIN = -0.00015
    const SPIN_BIAS_MAX = 0.00015

    // Merging (size + animation)
    const GROWTH_BOOST = 1.08 // bigger than area-preserving to “sell” the morph
    let MAX_RADIUS = 120
    let sizeScale = 1
    const OVER_GROW = 1.08 // overshoot amount during bounce
    const GROW_FRAMES = 16 // up phase
    const SETTLE_FRAMES = 14 // down phase

    const rand = (min: number, max: number) => min + Math.random() * (max - min)
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    // Poly “radius” (we’ll cache our own so scaling is easy/fast)
    const approxRadius = (b: any) => (b.bounds.max.x - b.bounds.min.x) * 0.5

    const mount = async () => {
      const M = await import('matter-js')
      ;({Engine, Render, Runner, Bodies, Composite, Events, World, Body} = M)

      const el = wrapRef.current
      if (!el || disposed) return

      // Engine + renderer
      engine = Engine.create({enableSleeping: true})
      engine.world.gravity.y = GRAVITY_Y
      engine.world.gravity.x = 0

      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const {clientWidth: w, clientHeight: h} = el

      const computeScale = (W: number) =>
        W <= 360 ? 0.4 : W <= 480 ? 0.55 : W <= 640 ? 0.7 : W <= 768 ? 0.85 : 1

      sizeScale = computeScale(w)
      MAX_RADIUS = 120 * sizeScale

      render = Render.create({
        element: el,
        engine,
        options: {
          width: w,
          height: h,
          background: 'transparent',
          wireframes: false,
          pixelRatio: dpr,
        },
      })

      Render.run(render)
      runner = Runner.create()
      Runner.run(runner, engine)

      // Bounds (invisible)
      const makeBounds = (W: number, H: number) => {
        const thick = 120
        const opts = {isStatic: true, render: {visible: false}}
        leftWall = Bodies.rectangle(-thick / 2, H / 2, thick, H * 3, opts)
        rightWall = Bodies.rectangle(W + thick / 2, H / 2, thick, H * 3, opts)
        floor = Bodies.rectangle(W / 2, H + 40, W + 400, 80, opts)
        World.add(engine.world, [leftWall, rightWall, floor])
      }
      makeBounds(w, h)

      // Spawner — pentagons with per-body drift + spin
      const spawn = () => {
        if (disposed) return
        const count = 1 + (Math.random() < 0.35 ? 1 : 0) // sometimes 2
        const bodies: any[] = []

        for (let i = 0; i < count; i++) {
          const x = rand(0, w)
          const r = rand(18, 38) * sizeScale
          const body = Bodies.polygon(x, -40, SIDES, r, {
            restitution: REST,
            friction: 0.01,
            frictionAir: AIR,
            render: {fillStyle: START_COLOR, strokeStyle: 'transparent'},
          })

          // custom per-body “plugin” state
          body.plugin = body.plugin || {}
          body.plugin.radius = r
          body.plugin.driftPhase = rand(0, Math.PI * 2)
          body.plugin.driftSpeed = rand(DRIFT_SPEED_MIN, DRIFT_SPEED_MAX)
          body.plugin.driftMag = DRIFT_FORCE * rand(0.6, 1.4)
          body.plugin.spinBias = rand(SPIN_BIAS_MIN, SPIN_BIAS_MAX)

          // tiny spin & nudge so they don’t look identical
          Body.setAngularVelocity(body, rand(-0.02, 0.02))
          Body.applyForce(body, body.position, {x: rand(-0.00005, 0.00005), y: 0})

          bodies.push(body)
        }

        World.add(engine.world, bodies)
      }

      // Queue merges so we don’t mutate in the collision callback
      type MergeJob = {a: any; b: any}
      let mergeQueue: MergeJob[] = []

      Events.on(engine, 'collisionStart', (evt: any) => {
        const scheduled = new Set<number>()
        for (const pair of evt.pairs) {
          const a = pair.bodyA
          const b = pair.bodyB
          if (a.isStatic || b.isStatic) continue

          // Only merge dynamic pentagons (convex bodies)
          const ra = (a.plugin?.radius as number) || approxRadius(a)
          const rb = (b.plugin?.radius as number) || approxRadius(b)
          if (!(ra > 0 && rb > 0)) continue

          if (scheduled.has(a.id) || scheduled.has(b.id)) continue
          scheduled.add(a.id)
          scheduled.add(b.id)
          mergeQueue.push({a, b})
        }
      })

      // Global wind (small) + per-body drift/tiny torque + merges + cleanup
      let windVX = 0,
        windVY = 0
      let targetVX = rand(-WIND_MAX, WIND_MAX)
      let targetVY = rand(-WIND_MAX * 0.5, WIND_MAX * 0.5)
      let nextChange = performance.now() + WIND_CHANGE_MS
      let tick = 0

      Events.on(engine, 'afterUpdate', () => {
        tick++

        const now = performance.now()
        if (now >= nextChange) {
          targetVX = rand(-WIND_MAX, WIND_MAX)
          targetVY = rand(-WIND_MAX * 0.5, WIND_MAX * 0.5)
          nextChange = now + WIND_CHANGE_MS
        }
        windVX += (targetVX - windVX) * WIND_LERP
        windVY += (targetVY - windVY) * WIND_LERP

        const all = Composite.allBodies(engine.world)

        // Apply forces
        for (const b of all) {
          if (b.isStatic || b.isSleeping) continue

          // subtle global wind (kept small)
          Body.applyForce(b, b.position, {
            x: (windVX + rand(-JITTER, JITTER)) * b.mass,
            y: (windVY + rand(-JITTER, JITTER) * 0.5) * b.mass,
          })

          // per-body drifting (non-uniform motion)
          if (b.plugin?.driftSpeed && b.plugin?.driftMag != null) {
            const phase = (b.plugin.driftPhase += b.plugin.driftSpeed)
            const fx = Math.cos(phase) * b.plugin.driftMag * b.mass
            const fy = Math.sin(phase * 0.7) * b.plugin.driftMag * 0.6 * b.mass
            Body.applyForce(b, b.position, {x: fx, y: fy})
          }

          // tiny “self-spin”
          if (b.plugin?.spinBias) {
            Body.setAngularVelocity(b, b.angularVelocity + b.plugin.spinBias)
          }

          // bounce-morph animation (if present)
          const anim = b.plugin?.morph
          if (anim) {
            // decide which target we’re heading to (overshoot first, then settle)
            const target = anim.phase === 'grow' ? anim.overshootR : anim.finalR
            const frames = anim.phase === 'grow' ? anim.growFrames : anim.settleFrames

            const p = clamp(anim.frame / frames, 0, 1)
            const eased = easeOutCubic(p)
            const desiredR = lerp(anim.fromR, target, eased)

            // scale body to reach desiredR (scale is multiplicative)
            const scale = clamp(desiredR / anim.currentR, 0.5, 2)
            if (Math.abs(scale - 1) > 1e-3) {
              Body.scale(b, scale, scale)
              anim.currentR *= scale
              b.plugin.radius = anim.currentR
            }

            anim.frame++
            if (anim.frame >= frames) {
              if (anim.phase === 'grow') {
                // switch to settle phase
                anim.phase = 'settle'
                anim.fromR = anim.currentR
                anim.frame = 0
              } else {
                // animation done
                delete b.plugin.morph
              }
            }
          }
        }

        // Do queued merges now
        if (mergeQueue.length) {
          for (const {a, b} of mergeQueue) {
            if (!a.position || !b.position) continue

            const ra = (a.plugin?.radius as number) || approxRadius(a)
            const rb = (b.plugin?.radius as number) || approxRadius(b)
            if (!(ra > 0 && rb > 0)) continue

            // area-preserving radius + presentation boost
            let rFinal = Math.sqrt(ra * ra + rb * rb) * GROWTH_BOOST
            rFinal = Math.min(rFinal, MAX_RADIUS)

            // mass-weighted position/velocity
            const m1 = a.mass || 1,
              m2 = b.mass || 1,
              M = m1 + m2
            const x = (a.position.x * m1 + b.position.x * m2) / M
            const y = (a.position.y * m1 + b.position.y * m2) / M
            const vx = (a.velocity.x * m1 + b.velocity.x * m2) / M
            const vy = (a.velocity.y * m1 + b.velocity.y * m2) / M
            const av = ((a.angularVelocity || 0) * m1 + (b.angularVelocity || 0) * m2) / M

            // start slightly smaller, then overshoot, then settle
            const rStart = rFinal * 0.86
            const rOver = rFinal * OVER_GROW

            const merged = Bodies.polygon(x, y, SIDES, rStart, {
              restitution: REST,
              friction: 0.01,
              frictionAir: AIR,
              render: {fillStyle: MERGED_COLOR, strokeStyle: 'transparent'},
            })

            // carry “personality”
            merged.plugin = merged.plugin || {}
            merged.plugin.radius = rStart
            merged.plugin.driftPhase = rand(0, Math.PI * 2)
            merged.plugin.driftSpeed = rand(DRIFT_SPEED_MIN, DRIFT_SPEED_MAX)
            merged.plugin.driftMag = DRIFT_FORCE * rand(0.6, 1.4)
            merged.plugin.spinBias = rand(SPIN_BIAS_MIN, SPIN_BIAS_MAX)

            // bounce-morph animation state
            merged.plugin.morph = {
              phase: 'grow', // then 'settle'
              fromR: rStart,
              currentR: rStart,
              overshootR: rOver,
              finalR: rFinal,
              frame: 0,
              growFrames: GROW_FRAMES,
              settleFrames: SETTLE_FRAMES,
            }

            // momentum
            Body.setVelocity(merged, {x: vx, y: vy})
            Body.setAngularVelocity(merged, av)

            // swap bodies
            World.remove(engine.world, a)
            World.remove(engine.world, b)
            World.add(engine.world, merged)
          }
          mergeQueue = []
        }

        // Cleanup: remove far-below
        const H = render.options.height ?? (wrapRef.current?.clientHeight || 0)
        const allAfter = Composite.allBodies(engine.world)
        for (const b of allAfter) {
          if (!b.isStatic && b.position.y > H + 300) {
            World.remove(engine.world, b)
          }
        }

        // Soft cap
        const dyn = allAfter.filter((b) => !b.isStatic)
        if (dyn.length > MAX_BODIES) {
          World.remove(engine.world, dyn.slice(0, dyn.length - MAX_BODIES))
        }
      })

      // Start
      spawn()
      spawnTimer = setInterval(spawn, SPAWN_EVERY_MS)

      // Resize
      const onResize = () => {
        if (!render || !wrapRef.current) return
        const {clientWidth: W, clientHeight: H} = wrapRef.current
        const dprNow = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

        render.options.width = W
        render.options.height = H
        render.canvas.style.width = `${W}px`
        render.canvas.style.height = `${H}px`
        render.canvas.width = Math.floor(W * dprNow)
        render.canvas.height = Math.floor(H * dprNow)
        Render.setPixelRatio(render, dprNow)
        Render.lookAt(render, {min: {x: 0, y: 0}, max: {x: W, y: H}})

        sizeScale = computeScale(W)
        MAX_RADIUS = 120 * sizeScale

        if (leftWall) World.remove(engine.world, leftWall)
        if (rightWall) World.remove(engine.world, rightWall)
        if (floor) World.remove(engine.world, floor)
        makeBounds(W, H)
      }

      window.addEventListener('resize', onResize)
      Render.lookAt(render, {min: {x: 0, y: 0}, max: {x: w, y: h}})

      return () => window.removeEventListener('resize', onResize)
    }

    mount()

    // Cleanup
    return () => {
      disposed = true
      try {
        clearInterval(spawnTimer)
        if (runner) Runner.stop(runner)
        if (render) {
          Render.stop(render)
          render.canvas?.remove?.()
          // @ts-ignore
          render.textures = {}
        }
        if (engine) {
          // @ts-ignore
          Composite.clear(engine.world, false, true)
          // @ts-ignore
          Engine.clear(engine)
        }
      } catch {}
    }
  }, [prefersReduced])

  return <div ref={wrapRef} className="absolute inset-0 -z-10 pointer-events-none" aria-hidden />
}
