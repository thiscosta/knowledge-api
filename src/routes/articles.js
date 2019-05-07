const express = require('express')
const { check, validationResult } = require('express-validator/check')
const ArticleController = require('../controllers/ArticleController')
const Passport = require('../config/passport')()
const admin = require('../config/admin')

const routes = express.Router()

//Article routes
routes.get('/', ArticleController.index)

routes.post('/', [
    check('name').isLength(2),
    check('email').isEmail(),
    check('password').isLength(8)
], Passport.authenticate(), admin(ArticleController.store))

routes.get('/:id', ArticleController.show)

routes.put('/:id', Passport.authenticate(), admin(ArticleController.update))

routes.delete('/:id', Passport.authenticate(), admin(ArticleController.destroy))

module.exports = routes
