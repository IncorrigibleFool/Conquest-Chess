import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class Account extends Component{
    
    
    render(){
        return(
            <>
                <h3>Account</h3>
                <Link to='/main/lobby'>
                    <button>Back</button>
                </Link>
            </>
        )
    }
}