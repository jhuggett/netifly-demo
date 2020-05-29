import { createAuthHandler } from 'next-tinacms-github'

export default createAuthHandler(
  process.env.APP_CLIENT_ID || 'a83089635b4f41c13502',
  process.env.APP_CLIENT_SECRET || '7ea661ce9271bb98d07ca573e85b4723b5f8a9b8'
)
