import React, {Component} from 'react'
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom'

export default class RegisterForm extends Component {
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            registrationSuccess: false,
            registrationError: false,
        }
    }

    handleUpdate = (event) => {
        const {value} = event.target
        this.setState({
            [event.target.name]: value,
            registrationError: false
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        const {username, password, firstname, lastname, email} = this.state
        try{
            const response = await axios.post('/auth/register', {username, password, firstname, lastname, email}) 
            this.setState({
                registrationSuccess: true
            })
        }catch(err){
            this.setState({
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                email: '',
                registrationError: true
            })
        }
    }

    
    render(){
        if(this.state.registrationSuccess){
            return(<Redirect to='/main/lobby'/>)
        }

        return(
            <>
            <form onSubmit={this.handleSubmit}>
                <input
                    name='firstname'
                    placeholder='Name'
                    value={this.state.firstname}
                    onChange={this.handleUpdate}
                />
                <input
                    name='lastname'
                    placeholder='Last name'
                    value={this.state.lastname}
                    onChange={this.handleUpdate}
                />
                <input
                    name='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={this.handleUpdate}
                />
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
                <button>Register</button>
            </form>
            {this.state.registrationError && <h3>Error in registration. Please try again.</h3>}
            <Link to='/login'>
                <button>Back</button>
            </Link>
            </>
        )
    }
}