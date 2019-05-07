module.exports = middleware => {
    return (req, res, next) => {
        try {
            if (req.user.admin) {
                middleware(req, res, next)
            } else {
                res.status(401).json({ success: false, message: "The user isn't admin" })
            }
        }
        catch (err) {
            res.status(401).send(err)
        }
    }
}