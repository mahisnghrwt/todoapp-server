const { User } = require('../model/user_model')
const { OAuth2Client } = new require('google-auth-library')
const google_oauth_client = new OAuth2Client(process.env.CLIENT_ID)

const listen = express => {
    create(express)
}

const create = (express) => {
    express.post("/api/auth/google", async (req, res) => {
        //Get idToken from request body
        const { idToken } = req.body
        try {
            //If valid this won't trigger catch block
            const ticket = await google_oauth_client.verifyIdToken({
                idToken,
                audience: process.env.CLIENT_ID
            })
            //Get the user email from payload
            const {email} = ticket.getPayload()
            //Set email inside session
            req.session.user = email
            //send email back to the user
            res.json({user: email})
            //If user email doesn't exist in the database, then register it
            const user = await User.findOne({
                email
            })
            if (!user) {
                const user = new User({
                    email: email
                })
                user.save()
                .then(_ => {
                    res.sendStatus(200)
                })
            }
        } catch (e) {
            console.error(`Error occured while verifying token!`)
            res.sendStatus(401)
        }        
    })
}

module.exports = {
    listen
}