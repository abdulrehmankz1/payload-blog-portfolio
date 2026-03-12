import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Project, Media } from '@/payload-types'

export const metadata = {
  title: 'Projects',
  description: 'My portfolio of projects',
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    sort: 'order',
    depth: 1,
  })

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Projects</h1>
      <p style={{ color: '#666', marginBottom: '3rem' }}>Things I've built</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {projects.map((project: Project) => {
          const cover = project.coverImage as Media | null
          const imageUrl = cover?.url ? `http://localhost:3000${cover.url}` : null

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}
              >
                {imageUrl && (
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={imageUrl}
                      alt={cover?.alt || project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{project.title}</h2>
                    {project.year && (
                      <span style={{ color: '#999', fontSize: '0.85rem' }}>{project.year}</span>
                    )}
                  </div>
                  <p
                    style={{
                      color: '#666',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                    }}
                  >
                    {project.tagline}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span
                        key={tech.id}
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: '#475569',
                        }}
                      >
                        {tech.icon} {tech.name}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {project.links?.live && (
                      <span style={{ color: '#2563eb', fontSize: '0.85rem' }}>Live Demo →</span>
                    )}
                    {project.links?.github && (
                      <span style={{ color: '#374151', fontSize: '0.85rem' }}>GitHub →</span>
                    )}
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
