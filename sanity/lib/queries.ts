import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    title,
    overview,
    hero->{ title, body, image{ asset->{ url } } },
    skills[]{ "title": coalesce(title, "") },
    mediaGallery[]{ title, description, url, image{ asset->{ url } } },
    cvSection{ content[], image{ asset->{ url } } },
    testimonials[]->{ _id, quote, author, role, portrait{ asset->{ url } } },

    // IMPORTANT: only return explicitly selected posts; otherwise []
    "blogPosts": select(
      count(coalesce(blogPosts, [])) > 0 =>
        blogPosts[]->{
          _id, _type, title,
          "slug": slug.current,
          "coverImage": coalesce(coverImage.asset->url, null),
          "overview": coalesce(overview, ingress),
          publishedAt,
          externalUrl,
          publisher,
          cardVariant
        },
      []
    ),
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id, _type, body, overview, title, "slug": slug.current
  }
`)

export const allBlogPostsQuery = defineQuery(`
  *[_type == "blogPost"] | order(coalesce(publishedAt, _createdAt) desc){
    _id, _type,
    "slug": slug.current,
    title,
    publishedAt,
    "coverImage": coalesce(coverImage.asset->url, null),
    overview,
    tags,
    publisher,
    externalUrl
  }
`)

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id, _type,
    title,
    publishedAt,
    publisher,
    "coverImage": coalesce(coverImage.asset->url, null),
    overview,
    body,
    "slug": slug.current,
    tags
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id, _type, footer, linkedinUrl,
    logoLight{ asset->{ url }, alt },
    logoDark{ asset->{ url }, alt },
    menuItems[]{ _key, ...@->{ _type, "slug": slug.current, title } },
    ogImage,
    "hasBlogPosts": count(*[_type == "blogPost" && defined(slug.current)]) > 0
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{ "slug": slug.current }
`)
