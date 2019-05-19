import React, {Component} from 'react'


export default class Login extends Component{
    
    render(){
        return(
            <div className='login-container'>
                <h1>Login</h1>
                <div>{this.props.children}</div>
            </div>
        )
    }
}