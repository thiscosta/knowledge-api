const Articles = require('../models/Article')
const Categories = require('../models/Category')

class ArticleController {

    constructor() {
        this.getChildCategories = this.getChildCategories.bind(this)
        this.articlesByCategory = this.articlesByCategory.bind(this)
    }

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

    async articlesByCategory(req, res) {
        let categories = await Categories.find()
        let ids = this.getChildCategories(categories, categories.filter(c => c._id == req.params.id), [])
        let articles = await Articles.find({
            'category': {$in: ids}
        }).populate('author')
        return res.status(200).json(articles)
    }

    getChildCategories(categories, parents, ids) {
        parents.forEach(category => {
            const isChild = node => node.parentId == category._id.toString()
            ids.push(category._id)
            this.getChildCategories(categories, categories.filter(isChild), ids)
        })
        return ids
    }

}
module.exports = new ArticleController()