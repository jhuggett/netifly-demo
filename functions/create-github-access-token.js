const CSRF_TOKEN_KEY = ""



const qs = require('qs')
const v4 = require('uuid').uuidv4
const axios = require('axios')
const serialize = require('cookie').serialize
const AES = require('crypto-js').AES


const route = (clientId, secret, signingKey) => async (event, context, callback) => {
    const tokenResp = await createAccessToken(clientId, secret, event.queryStringParameters.code, event.queryStringParameters.state)
    const { access_token, error } = qs.parse(tokenResp.data)
    if (error) {
        callback(error)
    } else {
        // Generate the csrf token
        const csrfToken = uuidv4()
        
        // Sign the amalgamated token
        const unsignedToken = `${csrfToken}.${access_token}`
        const signedToken = AES.encrypt(unsignedToken, signingKey).toString()

        // Set the csrf token as an httpOnly cookie
        const csrfCookie = serialize('csrfToken', csrfToken, {
            path: '/',
            httpOnly: true
        })

        // Return the amalgamated token
        callback(null, {
            statusCode: 200,
            headers: {
                'Set-Cookie': csrfCookie
            },
            body: JSON.stringify({ signedToken: signedToken })
        })

    }
}


const createAccessToken = (
clientId,
clientSecret,
code,
state
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

exports.handler = route(
    process.env.REACT_APP_APP_CLIENT_ID || '',
    process.env.APP_CLIENT_SECRET || '',
    process.env.SIGNING_KEY || ''
)