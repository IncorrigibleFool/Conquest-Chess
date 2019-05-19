import React, {Component} from 'react'
import './Login.css'

export default class Login extends Component{
    
    render(){
        return(
            <div className='login-container'>
                <div className='login-background'>
                    <div>{this.props.children}</div>
                </div>
            </div>
        )
    }
}