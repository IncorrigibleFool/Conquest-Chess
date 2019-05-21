import React, {Component} from 'react'
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom'
import {authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../redux/reducer'
import {connect} from 'react-redux'
import './Register.css'

export class RegisterForm extends Component {
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
            const login = await axios.post('/auth/register', {username, password, firstname, lastname, email})
            const userStats = await axios.get('/api/stats')

            const{authenticated, id} = login.data
            this.props.authenticate(authenticated)
            this.props.updateId(id)
            this.props.updateUsername(username)
            this.props.updateName({firstname, lastname})
            this.props.updateEmail(email)

            const{wins, losses, draws, points} = userStats.data
            this.props.updateStats({wins, losses, draws, points})

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
            <div className='registry-form'>
                <h1 id='header-text'>Welcome, new tactitian!</h1>
                <form className='registry-options' onSubmit={this.handleSubmit}>
                    <input
                        className='input-registry'
                        name='firstname'
                        placeholder='Name'
                        value={this.state.firstname}
                        onChange={this.handleUpdate}
                    />
                    <input
                        className='input-registry'
                        name='lastname'
                        placeholder='Last name'
                        value={this.state.lastname}
                        onChange={this.handleUpdate}
                    />
                    <input
                        className='input-registry'
                        name='email'
                        placeholder='Email'
                        value={this.state.email}
                        onChange={this.handleUpdate}
                    />
                    <input
                        className='input-registry'
                        name='username'
                        placeholder='Username'
                        value={this.state.username}
                        onChange={this.handleUpdate}
                    />
                    <input
                        className='input-registry'
                        name='password'
                        placeholder='Password'
                        value={this.state.password}
                        onChange={this.handleUpdate}
                    />
                    {!this.state.registrationError && <button type='submit' className='button blue first'>Register</button>}
                    {this.state.registrationError && <h3 id='registry-error'>Error in registration. Please try again.</h3>}
                    <Link id='back-container' to='/login'>
                        <button id='back-button' className='button blue last'>Back</button>
                    </Link>
                </form>
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

export default connect(null, mapDispatchToProps)(RegisterForm)