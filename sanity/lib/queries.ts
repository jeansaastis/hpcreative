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
    "blogPosts": select(
      defined(blogPosts) && count(blogPosts) > 0 =>
        blogPosts[]->{
          _id, _type,
          "slug": slug.current,
          title,
          publishedAt,
          publisher,
          "coverImage": coverImage.asset->url,
          overview,
          tags,
          externalUrl,
          cardVariant
        },
      *[_type == "blogPost"] | order(coalesce(publishedAt, _createdAt) desc)[0...6]{
        _id, _type,
        "slug": slug.current,
        title,
        publishedAt,
        publisher,
        "coverImage": coverImage.asset->url,
        overview,
        tags,
        externalUrl,
        cardVariant
      }
    )
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
    "coverImage": coverImage.asset->url,
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
    "coverImage": coverImage.asset->url,
    overview,
    body,
    "slug": slug.current,
    tags
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id, _type, footer, linkedinUrl,
    logo{ asset->{ url }, alt },
    menuItems[]{ _key, ...@->{ _type, "slug": slug.current, title } },
    ogImage
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{ "slug": slug.current }
`)
