require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const ctrl = require('./controller')
const socketIo = require('socket.io')
const path = require('path')

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env

//middleware
app.use(express.static(`${__dirname}/../build`))
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
    //lobby
    socket.on('lobby message', data => {
        io.sockets.emit('lobby message', data)
    })

    socket.on('new room', data => {
        io.sockets.emit('new room', data)
    })

    socket.on('new player', data => {
        io.sockets.emit('new player', data)
    })

    //rooms
    socket.on('join room', data => {
        socket.join(data.room)
        socket.to(data.room).emit('join room', data)
    })

    socket.on('join response', data => {
        socket.to(data.room).emit('join response', data)
    })

    socket.on('leave room', data => {
        socket.leave(data.room)
        var room = io.sockets.adapter.rooms[data.room]
        if(room === undefined){
            ctrl.deleteRoom(data.room)
        }
        io.in(data.room).emit('leave room', data)
        io.sockets.emit('room update', {room: data.room, connections : room})
    })

    socket.on('room message', data => {
        io.in(data.room).emit('room message', data)
    })

    socket.on('move', data => {
        socket.to(data.room).emit('move', data)
        io.in(data.room).emit('move console')
    })
})


//endpoints
app.get('/api/info', ctrl.getAccountInfo)
app.get('/api/stats', ctrl.getStats)
app.post('/auth/register', ctrl.register)
app.post('/auth/login', ctrl.login)
app.put('/auth/info/username', ctrl.updateAccountUsername)
app.put('/auth/info/email', ctrl.updateAccountEmail)
app.put('/api/stats/update', ctrl.updateStats)
app.put('/api/stats/penalty', ctrl.updatePenalty)
//app.put('/auth/info/password, ctrl.updateAccountPassword)
app.delete('/auth/logout', ctrl.logout)
app.delete('/auth/delete', ctrl.deleteUser)
app.get('/api/rooms', ctrl.getRooms)
app.put('/api/rooms', ctrl.updateRooms)
app.put('/api/rooms/players', ctrl.updatePlayers)

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
});