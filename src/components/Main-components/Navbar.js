import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'

export default class Navbar extends Component{
    constructor(){
        super()
        this.state ={
            logout: false,
            logoutError: false
        }
    }
    
    logout = async () => {
        try{
            await axios.delete('/auth/logout')
            this.setState({
                logout: true
            })
        }catch(err){
            this.setState({
                logoutError: true
            })
        }
    }
    
    render(){
        if(this.state.logout){
            return(<Redirect to='/login'/>)
        }

        return(
            <>
                <h2>Navbar</h2>
                <Link to='/main/account'>
                    <button>Account</button>
                </Link>
                <Link to='/main/stats'>
                    <button>Stats</button>
                </Link>
                <button onClick={this.logout}>Logout</button>
                {this.state.logoutError && <h3>Logout failed. Please try again.</h3>}
                {this.props.children}
            </>
        )
    }
}