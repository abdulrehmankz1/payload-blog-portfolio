import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'year', 'featured'],
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/projects/${doc?.slug}`
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ── Core ──────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Tagline',
      admin: {
        description: 'One-liner description shown in project cards',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full Description',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },

    // ── Media ─────────────────────────────────────
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover / Thumbnail Image',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Screenshot Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
      ],
    },

    // ── Tech Stack ────────────────────────────────
    {
      name: 'techStack',
      type: 'array',
      label: 'Technologies Used',
      admin: {
        description: 'Add each tech/framework/tool separately',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Technology',
          admin: {
            placeholder: 'e.g. Next.js, TypeScript, PostgreSQL',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (optional)',
          admin: {
            description: 'Emoji or icon name e.g. ⚛️',
          },
        },
      ],
    },

    // ── Links ─────────────────────────────────────
    {
      name: 'links',
      type: 'group',
      label: 'Project Links',
      fields: [
        {
          name: 'live',
          type: 'text',
          label: 'Live Demo URL',
          admin: { placeholder: 'https://myproject.com' },
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub Repository URL',
          admin: { placeholder: 'https://github.com/username/repo' },
        },
        {
          name: 'caseStudy',
          type: 'text',
          label: 'Case Study / Blog Post URL',
        },
      ],
    },

    // ── Taxonomy ──────────────────────────────────
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories',
      admin: { position: 'sidebar' },
    },

    // ── Status & Dates ────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
        { label: '🚧 In Progress', value: 'in-progress' },
        { label: '🗄️ Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year Built',
      admin: {
        position: 'sidebar',
        description: 'e.g. 2024',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Project',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage / top of portfolio',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 99,
      admin: {
        position: 'sidebar',
        description: 'Lower number = shown first (e.g. 1, 2, 3...)',
      },
    },

    // ── SEO ───────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 60,
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          label: 'Meta Description',
        },
      ],
    },
  ],
  timestamps: true,
}
