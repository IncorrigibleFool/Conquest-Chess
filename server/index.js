require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const ctrl = require('./controller')
const socketIo = require('socket.io')

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
})

const server = app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}.`)
})

const io = socketIo(server)

//socket
io.on('connection', socket => {
    console.log('New client connection.')

    socket.on('disconnect', () => {
        console.log('Client disconnected.')
    })
    
    socket.on('blast to lobby', data => {
        io.sockets.emit('lobby', data)
    })

    socket.on('move', data => {
        console.log('New movement')
        socket.broadcast.emit('move', data)
    })
})


//endpoints
app.get('/api/info', ctrl.getAccountInfo)
app.get('/api/stats', ctrl.getStats)
app.post('/auth/register', ctrl.register)
app.post('/auth/login', ctrl.login)
app.put('/auth/info/username', ctrl.updateAccountUsername)
app.put('/auth/info/email', ctrl.updateAccountEmail)
//app.put('/auth/info/password, ctrl.updateAccountPassword)
app.delete('/auth/logout', ctrl.logout)
app.delete('/auth/delete', ctrl.deleteUser)