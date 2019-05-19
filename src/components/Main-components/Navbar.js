import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../../redux/reducer'

export class Navbar extends Component{
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

            this.props.authenticate(false)
            this.props.updateId(null)
            this.props.updateUsername('')
            this.props.updateName({firstname: '', lastname: ''})
            this.props.updateStats({wins: null, losses: null, draws: null, points: null})
            this.props.updateEmail('')
            
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

const mapDispatchToProps = {
    authenticate,
    updateId,
    updateUsername,
    updateName,
    updateStats,
    updateEmail
}

export default connect(null, mapDispatchToProps)(Navbar)