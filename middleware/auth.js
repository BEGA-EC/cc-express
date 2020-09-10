const jwt = require('jsonwebtoken')

let auth = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).send({success: false, data: "Invalid token"})
    try {
        const payload = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = payload
        next()
    } catch (error) {
        res.status(400).send({success: false, data: "Invalid token"})
    }
}

module.exports = auth