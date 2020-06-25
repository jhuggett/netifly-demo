const CSRF_TOKEN_KEY = ""
import { AES, enc } from 'crypto-js'
import axios from 'axios'

export const apiProxy = (signingKey) => async (event, context, callback) => {
    const { headers, ...data } = JSON.parse(req.body)

    // Parse out the amalgamated token
    const token = (req.headers['authorization'] || '').split(' ')[1] || null

    const expectedCSRFToken = req.cookies[CSRF_TOKEN_KEY]

    if (token && expectedCSRFToken) {
        const decryptedToken = AES.decrypt(token, signingKey).toString(enc.Utf8)

        const [csrfToken, authToken] = decryptedToken.split('.')

        if (csrfToken == expectedCSRFToken) {
            try {
                const resp = await axios({
                    ...data,
                    headers: {
                    ...headers,
                    Authorization: 'token ' + authToken,
                    },
                })
    
            
                res.status(resp.status).json(resp.data)
                
            } catch (err) {
                res.status(err.response.status).json(err.response.data)
            }
            
        } else {
        res.status(401).json({ message: 'Invalid CSRF Token: Please try again' })
        }
    } else {
        res.status(401).json({ message: 'Missing Credentials: Please try again' })
    }
}
