import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Post, Media, User } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  return docs.map((post: Post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0] as Post | undefined
  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

function renderContent(content: any): string {
  if (!content?.root?.children) return ''
  return content.root.children
    .map((node: any) => {
      if (node.type === 'paragraph') {
        return node.children?.map((child: any) => child.text || '').join('') || ''
      }
      return ''
    })
    .filter(Boolean)
    .join('\n\n')
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  const post = docs[0] as Post | undefined
  if (!post) notFound()

  const cover = post.coverImage as Media | null
  const author = post.author as User | null
  const imageUrl = cover?.url ?? null

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link href="/blog" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Blog
      </Link>

      <header style={{ margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
          {post.title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#666',
            fontSize: '0.9rem',
          }}
        >
          {author?.name && <span>By {author.name}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>
      </header>

      {imageUrl && (
        <div
          style={{
            height: '400px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          <img
            src={imageUrl}
            alt={cover?.alt || post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#374151' }}>
        {renderContent(post.content)
          .split('\n\n')
          .map((para, i) => (
            <p key={i} style={{ marginBottom: '1.5rem' }}>
              {para}
            </p>
          ))}
      </div>
    </main>
  )
}
