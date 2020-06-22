const CSRF_TOKEN_KEY = ""



const qs = require('qs')
const v4 = require('uuid').uuidv4
const axios = require('axios')
const serialize = require('cookie').serialize
const AES = require('crypto-js').AES



exports.handler = (clientId, secret, signingKey) => (event, context, callback) => {
    console.log({ event, context });


    createAccessToken(clientId, secret, event.query.code, event.query.state).then(
        (tokenResp) => {
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
            // res.setHeader(
            // 'Set-Cookie',
            // serialize(CSRF_TOKEN_KEY, csrfToken, {
            //     path: '/',
            //     httpOnly: true,
            // })
            // )
    
            // // Return the amalgamated token
            // res.status(200).json({ signedToken })
        }
        }
    )
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
