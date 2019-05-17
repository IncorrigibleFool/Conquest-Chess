const bcrypt = require('bcryptjs')

var id = 0
var rooms = []

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password, firstname, lastname, email} = req.body
        const {session} = req

        if(!username || !password || !firstname || !lastname || !email){
            return res.sendStatus(400)
        }

        let emailTaken = await db.checkEmail({email})
        emailTaken = + emailTaken[0].count
        let usernameTaken = await db.checkUsername({username})
        usernameTaken = + usernameTaken[0].count

        if(emailTaken !== 0 || usernameTaken !== 0){
            return res.sendStatus(409)
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        try{
            let id = await db.registerUser({username, hash, firstname, lastname, email})
            const authenticated = true

            session.user = {
                username,
                hash,
                id: id[0].id
            }
            res.send({authenticated, id: id[0].id})
        }catch(err){
            res.sendStatus(500)
        }
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {username, password} = req.body
        try{
            let user = await db.login({username})
            session.user = user[0]
            const authenticated = bcrypt.compareSync(password, user[0].password)

            if (authenticated){
                res.send({authenticated, id: user[0].id})
            }else{
                throw new Error(401)
            }
        }catch(err){
            res.sendStatus(401)
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    getAccountInfo: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        try{
            const {id} = session.user
            const info = await db.getUserInfo({id})
            res.send(info[0])
        }catch(err){
            res.sendStatus(500)
        }
    },

    updateAccountUsername: async(req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {username} = req.body
        const {id} = session.user

        if(!username){
            return res.sendStatus(400)
        }

        let usernameTaken = await db.checkUsername({username})
        usernameTaken = + usernameTaken[0].count
        if(usernameTaken !== 0){
            return res.sendStatus(409)
        }

        try{
            await db.updateUserUsername({username, id})
            res.sendStatus(200)
        }catch(err){
            res.sendStatus(500)
        }
    },

    updateAccountEmail: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {email} = req.body
        const {id} = session.user

        if(!email){
            return res.sendStatus(400)
        }

        let emailTaken = await db.checkEmail({email})
        emailTaken = + emailTaken[0].count
        if(emailTaken !==0){
            return res.sendStatus(409)
        }

        try{
            await db.updateUserEmail({email, id})
            res.sendStatus(200)
        }catch(err){
            res.sendStatus(500)
        }
    },

    getStats: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        try{
            const {id} = session.user
            const stats = await db.getUserStats({id})
            res.send(stats[0])
        }catch(err){
            res.sendStatus(500)
        }
    },

    updateStats: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {wins, losses, draws, points} = req.body
        try{
            const {id} = session.user
            await db.updateUserStats({wins, losses, draws, points, id})
            res.sendStatus(200)
        }catch(err){
            res.sendStatus(500)
        }
    },

    updatePenalty: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.body
        try{
            await db.updateUserPenalty({id})
            res.sendStatus(200)
        }catch(err){
            res.sendStatus(500)
        }
    },

    deleteUser: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {id} = session.user
        try{
            await db.deleteUser({id})
            req.session.destroy()
            res.sendStatus(200)
        }catch(err){
            res.sendStatus(500)
        }
    },

    getRooms: (req, res) => {
        try{
            res.send(rooms)
        }catch(err){
            res.sendStatus(500)
        }
    },

    updateRooms: (req, res) => {
        const {name, color, players} = req.body
        var roomId = ++id
        rooms.push({name, color, players, roomId})
        try{
            res.send(rooms)
        }catch(err){
            res.sendStatus(500)
        }
    },
    
    deleteRoom: (room) => {
        const index = rooms.indexOf(room)
        rooms.splice(index, 1)
    },

    updatePlayers: (req, res) => {
        const {username, index} = req.body
        rooms[index].players.push(username)
        try{
            res.send(rooms)
        }catch(err){
            res.sendStatus(500)
        }
    }
}