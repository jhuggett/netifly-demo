import { createAuthHandler } from 'next-tinacms-github'

export default createAuthHandler(
  process.env.REACT_APP_APP_CLIENT_ID || '',
  process.env.APP_CLIENT_SECRET || '',
  process.env.SIGNING_KEY || ''
)
