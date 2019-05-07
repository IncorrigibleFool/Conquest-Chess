import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'

export default class LoginForm extends Component{
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
            const response = await axios.post('/auth/login', {username, password})
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