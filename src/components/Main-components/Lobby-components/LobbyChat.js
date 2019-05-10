import React, {Component} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'

export class LobbyChat extends Component{
    constructor(){
        super()
        this.state ={
            messages: [],
            message: ''
        }
        this.socket = io.connect()
        this.socket.on('lobby', data => this.updateMessages(data))
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    submitMessage = () => {
        this.socket.emit('blast to lobby', {username: this.props.username, message: this.state.message})
    }

    updateMessages = (data) => {
        const {message, username} = data
        this.setState({
            messages: [...this.state.messages,{username, message}]
        })
    }

    render(){
        const messages = this.state.messages.map((message, index) => (
            <div key={index}>
                <h5>{message.username}: </h5>
                <p>{message.message}</p>
            </div>
        ))
        return(
            <>
                <h4>Lobby Chat</h4>
                {messages}
                <input 
                    onChange={this.handleChange}
                    name='message'
                    value={this.state.message}
                />
                <button onClick={this.submitMessage}>Submit</button>
            </>
        )
    }
}

const mapStateToProps = (reduxStore) => {
    const {username} = reduxStore
    return{username}
}

export default connect(mapStateToProps)(LobbyChat)