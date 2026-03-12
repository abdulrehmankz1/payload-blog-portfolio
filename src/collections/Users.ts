import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Enables authentication for this collection
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  access: {
    // Only admins can read the users list
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Regular users can only read their own document
      return { id: { equals: user?.id } }
    },
    create: () => true, // Anyone can register
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Author', value: 'author' },
      ],
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Bio',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Picture',
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Links',
      fields: [
        { name: 'github', type: 'text', label: 'GitHub URL' },
        { name: 'twitter', type: 'text', label: 'Twitter / X URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'website', type: 'text', label: 'Personal Website' },
      ],
    },
  ],
  timestamps: true,
}
