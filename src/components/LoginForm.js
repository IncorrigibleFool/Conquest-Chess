import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux';
import{authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../redux/reducer'
import './Login.css'

export class LoginForm extends Component{
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            loginError: false,
            loginSuccess: false,
            loginAttempt: false
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
        this.setState({
            loginAttempt: true
        })
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
                loginError: true,
                loginAttempt: false
            })
        }
    }
    
    render(){
        if(this.state.loginSuccess){
            return(<Redirect to='/main/lobby'/>)
        }

        return(
            <div className='login-form-container'>
                <div className='login-form'>
                    <img id='logo' src={require("../assets/logo.png")} alt='logo'></img>
                    <form id='login-options' onSubmit={this.handleSubmit}>
                        <input
                            className='input-login'
                            type='text'
                            name='username'
                            placeholder='Username'
                            value={this.state.username}
                            onChange={this.handleUpdate}
                        />
                        <input
                            className='input-login'
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={this.state.password}
                            onChange={this.handleUpdate}
                        />
                        <button className='button'>Login</button>
                    </form>
                    {this.state.loginError && <h3 id='login-error'>Username or password is incorrect. Please try again.</h3>}
                    {
                        !this.state.loginAttempt &&
                        <Link to='/register'>
                            <button className='button'>Register</button>
                        </Link>
                    }
                    {
                        this.state.loginAttempt &&
                        <div className='circle-loader'></div>
                    }
                </div>
            </div>
            
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