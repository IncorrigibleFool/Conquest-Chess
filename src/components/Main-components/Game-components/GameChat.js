import React, {Component} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'

export default class GameChat extends Component{
    constructor(){
        super()
        this.state = {
            messages: [],
            message: ''
        }
    }
    
    render(){
        return(
            <h3>Game Chat</h3>
        )
    }
}