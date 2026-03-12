import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Project, Media } from '@/payload-types'

// Fetch data directly from Payload (server component — no API calls needed)
async function getData() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, projectsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
      depth: 1, // Resolve relationships 1 level deep (author, coverImage)
    }),
    payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' }, featured: { equals: true } },
      sort: 'order',
      limit: 4,
      depth: 1,
    }),
  ])

  return {
    posts: postsResult.docs as Post[],
    projects: projectsResult.docs as Project[],
  }
}

export default async function HomePage() {
  const { posts, projects } = await getData()

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
          Hi, I'm a Developer 👋
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '600px', margin: '0 auto 2rem' }}>
          I write about web development and build things with modern technologies.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/blog" style={btnStyle('#0f172a', '#fff')}>
            Read Blog
          </Link>
          <Link href="/projects" style={btnStyle('#fff', '#0f172a', true)}>
            View Projects
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <SectionHeader title="Featured Projects" href="/projects" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section>
          <SectionHeader title="Latest Posts" href="/blog" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{title}</h2>
      <Link href={href} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}>
        View all →
      </Link>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const cover = post.coverImage as Media | null
  const imageUrl = cover?.url ? cover.url : null

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={cardStyle}>
        {imageUrl && (
          <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            <img
              src={imageUrl}
              alt={cover?.alt || post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ padding: '1.25rem' }}>
          <h3
            style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}
          >
            {post.title}
          </h3>
          <p
            style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, marginBottom: '0.75rem' }}
          >
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.readingTime && <span>· {post.readingTime} min read</span>}
          </div>
        </div>
      </article>
    </Link>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const cover = project.coverImage as Media | null
  const imageUrl = cover?.url ? cover.url : null

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={cardStyle}>
        {imageUrl && (
          <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            <img
              src={imageUrl}
              alt={cover?.alt || project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {project.title}
          </h3>
          <p
            style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, marginBottom: '0.75rem' }}
          >
            {project.tagline}
          </p>
          {/* Tech stack badges */}
          {project.techStack && project.techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {project.techStack.slice(0, 4).map((tech) => (
                <span key={tech.id} style={badgeStyle}>
                  {tech.icon} {tech.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

// ── Styles ─────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  background: '#fff',
}

const badgeStyle: React.CSSProperties = {
  background: '#f1f5f9',
  padding: '0.2rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  color: '#475569',
}

function btnStyle(bg: string, color: string, outline = false): React.CSSProperties {
  return {
    background: bg,
    color,
    padding: '0.75rem 1.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    border: outline ? '2px solid #0f172a' : 'none',
  }
}
