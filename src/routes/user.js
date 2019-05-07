const express = require('express')

const UserController = require('../controllers/UserController')
const Passport = require('../config/passport')()
const admin = require('../config/admin')

const routes = express.Router()

//User routes
routes.get('/', Passport.authenticate(), admin(UserController.index))
routes.post('/', Passport.authenticate(), admin(UserController.store))
routes.get('/:id', Passport.authenticate(), UserController.show)
routes.put('/:id', Passport.authenticate(), admin(UserController.update))
routes.delete('/:id', Passport.authenticate(), admin(UserController.destroy))

module.exports = routes
