require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URL
}))





const port = process.env.PORT || 3001
app.listen(port)