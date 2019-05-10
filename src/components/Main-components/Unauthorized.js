import React, {Component} from 'react'
import {Redirect, NavLink} from 'react-router-dom'

export default class Unauthorized extends Component{
    state = {
        redirect: false
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                redirect: true
            })
        }, 2000)
    }
    
    render(){
        return(
            <>
                <h1>You must be logged-in to view this page.</h1>
                <h2>You will be redirected to the login page momentarily.</h2>
                <NavLink to='/login'>Click here if you are not redirected</NavLink>
                {this.state.redirect && <Redirect to='/login'/>}
            </>
        )
    }
}