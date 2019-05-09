const express = require('express')
const { check, body } = require('express-validator/check')
const ArticleController = require('../controllers/ArticleController')
const CategoryController = require('../controllers/CategoryController')
const Passport = require('../config/passport')()
const admin = require('../config/admin')
const Categories = require('../models/Category')
const routes = express.Router()

//Article routes
routes.get('/', CategoryController.index)

routes.post('/', Passport.authenticate(), [
    check('name').isLength(2),
], admin(CategoryController.store))

routes.get('/tree', CategoryController.getTree)

routes.get('/:id', CategoryController.show)

routes.put('/:id', Passport.authenticate(), admin(CategoryController.update))

routes.delete('/:id', Passport.authenticate(), admin(CategoryController.destroy))

routes.get('/:id/articles', ArticleController.articlesByCategory)

module.exports = routes
