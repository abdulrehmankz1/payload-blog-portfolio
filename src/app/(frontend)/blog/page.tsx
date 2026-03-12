import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Media } from '@/payload-types'

export const metadata = {
  title: 'Blog',
  description: 'All blog posts',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
  })

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Blog</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {posts.map((post: Post) => {
          const cover = post.coverImage as Media | null
          const imageUrl = cover?.url ?? null

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{
                  display: 'grid',
                  gridTemplateColumns: imageUrl ? '200px 1fr' : '1fr',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              >
                {imageUrl && (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', minHeight: '140px' }}>
                    <img
                      src={imageUrl}
                      alt={cover?.alt || post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {post.title}
                  </h2>
                  <p style={{ color: '#666', marginBottom: '1rem', lineHeight: 1.6 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>
                    {post.publishedAt && (
                      <time>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.readingTime && <span> · {post.readingTime} min read</span>}
                  </div>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
