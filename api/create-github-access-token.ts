const ACCESS_TOKEN_KEY = 'github_access_token'

const qs = require('qs')
const axios = require('axios')
import { serialize } from 'cookie'

export const createAuthHandler = (clientId: string, secret: string) => (
  req: any,
  res: any
) => {

  console.log("createAuthHandler");
  
  console.log(clientId, secret);
  

  createAccessToken(clientId, secret, req.query.code, req.query.state).then(
    (tokenResp: any) => {
      const { access_token, error } = qs.parse(tokenResp.data)
      if (error) {
        res.status(400).json({ error })
      } else {
        res.setHeader(
          'Set-Cookie',
          serialize(ACCESS_TOKEN_KEY, access_token, {
            path: '/',
            httpOnly: true,
          })
        )
        res.status(200).json({})
      }
    }
  )
}

const createAccessToken = (
  clientId: string,
  clientSecret: string,
  code: string,
  state: string
) => {
  return axios.post(
    `https://github.com/login/oauth/access_token`,
    qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      state,
    })
  )
}

export default createAuthHandler(
  process.env.REACT_APP_APP_CLIENT_ID || '',
  process.env.APP_CLIENT_SECRET || ''
)