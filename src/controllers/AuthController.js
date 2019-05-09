const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const Users = require('../models/User')

class Auth {
    constructor() {
        this.signin = this.signin.bind(this)
    }

    async signin(req, res) {

        if (!req.body.email || !req.body.password) {
            return res.status(404).json({ success: false, message: 'Must provide e-mail and password' })
        }

        const user = await Users.findOne({
            'email': req.body.email,
        })

        if (!user) return res.status(400).json({ success: false, message: 'User not found' });
        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid e-mail or password' })

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, process.env.SECRET)
        })
    }

    async validateToken(req, res) {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, process.env.SECRET)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {

        }
    }
}

module.exports = new Auth()