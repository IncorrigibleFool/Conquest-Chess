const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password, firstname, lastname, email} = req.body
        const {session} = req
        let emailTaken = await db.checkEmail({email})
        emailTaken = + emailTaken[0].count
        let usernameTaken = await db.checkUsername({username})
        usernameTaken = + usernameTaken[0].count

        if(emailTaken !== 0 || usernameTaken !== 0){
            return res.sendStatus(409)
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        let id = await db.registerUser({username, hash, firstname, lastname, email})

        session.user = {
            username,
            hash,
            id: id[0].id
        }
        res.sendStatus(200)
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const {session} = req
        const {username} = req.body
        try{
            let user = await db.login({username})
            session.user = user[0]
            const authenticated = bcrypt.compareSync(req.body.password, user[0].password)

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
    }
}