const Users = require('../models/User')
const crypto = require('crypto');

class UserController {

    async index(req, res) {
        const users = await Users.find()

        return res.json(users)
    }

    async store(req, res) {
        if (!req.body) return res.status(400).json({ success: false, message: 'User must be provided' })

        req.body.password = crypto.createHmac('sha256', process.env.SECRET)
            .update(req.body.password)
            .digest('hex')

        const user = await Users.create(req.body)

        return res.json(user)
    }

    async show(req, res) {
        const user = await Users.findById(req.params.id)

        if (!user) return res.status(404).json({ success: false, message: 'User with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(user)
    }

    async update(req, res) {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!user) return res.status(404).json({ success: false, message: 'User with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(user)
    }

    async destroy(req, res) {
        await Users.findByIdAndDelete(req.params.id)
        return res.status(200).send()
    }

}
module.exports = new UserController()