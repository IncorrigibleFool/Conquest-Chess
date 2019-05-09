import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux';
import{authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../redux/reducer'

export class LoginForm extends Component{
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            loginError: false,
            loginSuccess: false
        }
    }

    handleUpdate = (event) => {
        const {value} = event.target
        this.setState({
            [event.target.name]: value,
            loginError: false
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        const {username, password} = this.state
        try{
            const login = await axios.post('/auth/login', {username, password})
            const userInfo = await axios.get('/api/info')
            const userStats = await axios.get('/api/stats')
            
            const {authenticated, id} = login.data
            this.props.authenticate(authenticated)
            this.props.updateId(id)
            this.props.updateUsername(username)

            const {firstname, lastname, email} = userInfo.data
            this.props.updateName({firstname, lastname})
            this.props.updateEmail(email)

            const {wins, losses, draws, points} = userStats.data
            this.props.updateStats({wins, losses, draws, points})
            
            this.setState({
                loginSuccess: true
            })
        }catch(err){
            this.setState({
                username: '',
                password: '',
                loginError: true
            })
        }
    }
    
    render(){
        if(this.state.loginSuccess){
            return(<Redirect to='/main/lobby'/>)
        }

        return(
            <>
            <form onSubmit={this.handleSubmit}>
                <input
                    name='username'
                    placeholder='Username'
                    value={this.state.username}
                    onChange={this.handleUpdate}
                />
                <input
                    name='password'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={this.handleUpdate}
                />
                <button>Login</button>
            </form>
            {this.state.loginError && <h3>Username or password is incorrect. Please try again.</h3>}
            <Link to='/register'>
                <button>Register</button>
            </Link>
            </>
        )
    }
    
}

const mapDispatchToProps = {
    authenticate,
    updateId,
    updateUsername,
    updateName,
    updateEmail,
    updateStats
}

export default connect(null, mapDispatchToProps)(LoginForm)