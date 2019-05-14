const Users = require('../models/User')
const bcrypt = require('bcrypt-nodejs');

class UserController {

    constructor() {
        this.encryptPassword = this.encryptPassword.bind(this)
        this.store = this.store.bind(this)
        this.update = this.update.bind(this)
    }

    async index(req, res) {
        const users = await Users.find()

        return res.json(users)
    }

    async store(req, res) {
        if (!req.body) return res.status(400).json({ success: false, message: 'User must be provided' })
        if (!req.originalUrl.startsWith('/users')) req.body.admin = false
        if (!req.user || !req.user.admin) req.body.admin = false

        req.body.password = this.encryptPassword(req.body.password)
        delete req.body.confirmPassword

        const user = await Users.create(req.body)

        return res.json(user)
    }

    encryptPassword(password) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    async show(req, res) {
        const user = await Users.findById(req.params.id)

        if (!user) return res.status(404).json({ success: false, message: 'User with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(user)
    }

    async update(req, res) {

        if (req.body.password && req.body.password.length < 8) return res.status(400).json({ success: false, message: 'The password must contain at least 8 characters' })

        req.body.password = this.encryptPassword(req.body.password)

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