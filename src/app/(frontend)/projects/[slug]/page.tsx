import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Project, Media } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })
  return docs.map((p: Project) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 })
  const project = docs[0] as Project | undefined
  if (!project) return {}
  return {
    title: project.seo?.metaTitle || project.title,
    description: project.seo?.metaDescription || project.tagline,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  const project = docs[0] as Project | undefined
  if (!project) notFound()

  const cover = project.coverImage as Media | null
  const imageUrl = cover?.url ? `http://localhost:3000${cover.url}` : null

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link href="/projects" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Projects
      </Link>

      <header style={{ margin: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.title}</h1>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>{project.tagline}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.6rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }}>
                GitHub
              </a>
            )}
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.6rem 1.25rem', background: '#0f172a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </header>

      {imageUrl && (
        <div style={{ position: 'relative', height: '450px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          <Image src={imageUrl} alt={cover?.alt || project.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Tech Stack</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.techStack.map((tech) => (
              <span key={tech.id} style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155' }}>
                {tech.icon} {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#374151' }}>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Project description renders here. Add the Lexical HTML serializer to render rich text.
        </p>
      </div>
    </main>
  )
}
