import React, {Component} from 'react'
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom'
import {authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../redux/reducer'
import {connect} from 'react-redux'

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
                <button>Submit</button>
            </form>
            {this.state.registrationError && <h3>Error in registration. Please try again.</h3>}
            <Link to='/login'>
                <button>Back</button>
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

export default connect(null, mapDispatchToProps)(RegisterForm)