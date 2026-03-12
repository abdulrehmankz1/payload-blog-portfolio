import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${doc?.slug}`
    },
  },
  access: {
    // Published posts are public; drafts are admin-only
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Authors can only update their own posts
      return {
        author: { equals: user?.id },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ── Core Content ──────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. e.g. my-first-post',
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
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt / Summary',
      required: true,
      maxLength: 200,
      admin: {
        description: 'Short description shown in post cards (max 200 chars)',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover Image',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Post Content',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },

    // ── Taxonomy & Metadata ───────────────────────
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Author',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        // Auto-set author to current user on create
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && !value) {
              return req.user?.id
            }
            return value
          },
        ],
      },
    },

    // ── Publishing ────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
        { label: '🗄️ Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish Date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        condition: (data) => data?.status === 'published',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Auto-set publishedAt when status changes to published
            if (siblingData?.status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Post',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this post in the featured section',
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
          label: 'Meta Title',
          maxLength: 60,
          admin: {
            description: 'Overrides post title for search engines (max 60 chars)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          admin: {
            description: 'Search engine description (max 160 chars)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: {
            description: 'Image shown when shared on social media (1200×630 recommended)',
          },
        },
      ],
    },

    // ── Reading Time ──────────────────────────────
    {
      name: 'readingTime',
      type: 'number',
      label: 'Reading Time (minutes)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-calculate reading time (~200 words per minute)
        if (data.content) {
          const text = JSON.stringify(data.content)
          const wordCount = text.split(/\s+/).length
          data.readingTime = Math.ceil(wordCount / 200)
        }
        return data
      },
    ],
  },
  timestamps: true,
}
