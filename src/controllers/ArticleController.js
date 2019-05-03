const Articles = require('../models/Article')

class ArticleController {

    async index(req, res) {
        const articles = await Articles.find()

        return res.json(articles)
    }

    async store(req, res) {
        if (!req.body) return res.status(400).json({ success: false, message: 'Articles must be provided' })

        const article = await Articles.create(req.body)

        return res.json(article)
    }

    async show(req, res) {
        const article = await Articles.findById(req.params.id)

        if (!article) return res.status(404).json({ success: false, message: 'Articles with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(article)
    }

    async update(req, res) {
        const article = await Articles.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!article) return res.status(404).json({ success: false, message: 'Articles with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(article)
    }

    async destroy(req, res) {
        await Articles.findByIdAndDelete(req.params.id)
        return res.status(200).send()
    }

}
module.exports = new ArticleController()