import React, {Component} from 'react'
import io from 'socket.io-client'

export default class LobbyChat extends Component{
    constructor(){
        super()

        this.socket = io.connect()
    }

    render(){
        return(
            <>
                <h4>Lobby Chat</h4>
            </>
        )
    }
    
}