require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const ctrl = require('./controller')

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env

//middleware
app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//database
massive(CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('Database connected.')
    console.log(`Tables accessible: `, dbInstance.listTables())
    app.listen(SERVER_PORT, () => {
        console.log(`Listening on port: ${SERVER_PORT}.`)
    })
})

//endpoints
app.post('/auth/register', ctrl.register)
app.post('/auth/login', ctrl.login)
app.delete('/auth/logout', ctrl.logout)
app.get('/api/info', ctrl.getAccountInfo)
app.get('/api/stats', ctrl.getStats)