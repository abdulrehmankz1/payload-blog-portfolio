import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin panel settings
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Blog & Portfolio CMS',
      favicon: '/favicon.ico',
    },
  },

  // Default rich text editor
  editor: lexicalEditor(),

  // Register all collections
  collections: [
    Users,
    Media,
    Categories,
    Posts,
    Projects,
  ],

  // MongoDB database adapter
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // TypeScript type generation
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Image processing
  sharp,

  // CORS for your frontend
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],

  // Security
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-production',
})
