const router = require('express').Router()
const { Login } = require('../controller/authController')

router
    .route('/login')
    .post(Login)

module.exports = router