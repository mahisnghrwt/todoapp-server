const { User } = require('../model/user_model')
const { OAuth2Client } = new require('google-auth-library')
const google_oauth_client = new OAuth2Client(process.env.CLIENT_ID)
const {activeUsers, memoryStore} = require('../utility')

const listen = express => {
    create(express)
    update(express)
}

const update = express => {
    express.put('/api/user', async (req, res) => {
        if (!req.body.sort) return res.sendStatus(400)
        const user = await User.findById(req.session.userId)
        if (!user) {
            return res.sendStatus(500)
        }
        user.sort = req.body.sort
        user.save((err, doc) => {
            if (err) {
                res.sendStatus(500)
                console.error('flag 1', err)
            }

            res.json(doc)
        })
    })
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
            //If user email doesn't exist in the database, then register it
            var user = await User.findOne({
                email
            })
            if (!user) {
                user = new User({
                    email: email
                })
                user.save(err => {
                    if (err) console.error(err)
                })
                .catch(err => {
                    console.log(err)
                })
            }

            //Check if the user has an active session
            if (activeUsers.has(req.session.user)) {
                //Delete the previous session
                memoryStore.destroy(activeUsers.get(req.session.user), err => {
                    if (err)
                        throw err
                })
            }
            //Set the user as active
            activeUsers.set(req.session.user, req.sessionID)

            req.session.userId = user._id

            console.log('User logged in: \n', 'req.session.userId: ', req.session.userId, ', req.session.user: ', req.session.user)

            res.json(user)
        } catch (e) {
            console.error(`Error occured while verifying token!`)
            res.sendStatus(401)
        }        
    })
}

module.exports = {
    listen
}