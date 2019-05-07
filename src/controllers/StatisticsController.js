const Users = require('../models/User')
const Articles = require('../models/Article')
const Categories = require('../models/Category')

class StatisticsController {

    async index(req, res, next) {
        let users = await Users.countDocuments()
        let articles = await Articles.countDocuments()
        let categories = await Categories.countDocuments()
        return res.status(200).json({ users, articles, categories })
    }

}

module.exports = new StatisticsController()