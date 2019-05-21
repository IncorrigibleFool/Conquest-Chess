import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../../redux/reducer'
import './Navbar.css'

export class Navbar extends Component{
    constructor(){
        super()
        this.state ={
            logout: false,
            logoutError: false,
            menu: false
        }
    }

    menu = () => {
        this.setState({
            menu: !this.state.menu
        })
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
                <div id='navbar-container' >
                    <img id='navbar-logo' src={require("../../assets/logo.png")} alt='logo'/>
                    <Link to='/main/lobby'>
                        <button className='button nav-button'>Lobby</button>
                    </Link>
                    <Link to='/main/stats'>
                        <button className='button nav-button'>Stats</button>
                    </Link>
                    <Link to='/main/account'>
                        <button className='button nav-button'>Account</button>
                    </Link>
                    <button className='button nav-button' onClick={this.logout}>Logout</button>
                    {!this.state.menu && <button id='nav-menu' className='button hidden' onClick={this.menu}>{`Menu \u2630`}</button>}
                    <div>
                        {
                            this.state.menu &&
                            <div id='nav-menu-options'>
                                <button onClick={this.menu} className='button' id='nav-menu'>Close</button>
                                <Link to='/main/lobby'>
                                    <button className='button' id='nav-menu'>Lobby</button>
                                </Link>
                                <Link to='/main/stats'>
                                    <button className='button' id='nav-menu'>Stats</button>
                                </Link>
                                <Link to='/main/account'>
                                    <button className='button' id='nav-menu'>Account</button>
                                </Link>
                                <button className='button' id='nav-menu' onClick={this.logout}>Logout</button>
                            </div>
                        }
                    </div>
                </div>
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