const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
router.post('/', async (req, res) => {
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send({success: false, data: "La combinación de usuario y contraseña no es válida."});
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if (!validPwd) return res.status(400).send({success: false, data: "La combinación de usuario y contraseña no es válida."});
    if (user.confirmationCode != null) return res.status(403).send({success: false, data: "No ha confirmado su email."});
    const token = jwt.sign({_id: user._id, role: user.role, email: user.email}, process.env.JWT_TOKEN)
    res.status(201).send({
        token: token,
        id: user._id
    })
})

module.exports = router
