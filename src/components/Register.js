import React, {Component} from 'react'
import './Register.css'

export default class Register extends Component{
    render(){
        return(
            <div className='registry-background'>
                <div>{this.props.children}</div>
            </div>
        )
    }
}