import React, {Component} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'

export class LobbyChat extends Component{
    constructor(props){
        super(props)
        this.state ={
            messages: [],
            message: ''
        }
        this.socket = io.connect()
        this.socket.on('lobby message', data => this.updateMessages(data))
    }

    componentWillUnmount(){
        this.socket.disconnect()
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    handleKeyPress = (event) => {
        if(event.which === 13){
            this.submitMessage()
        }
    }

    submitMessage = () => {
        this.socket.emit('lobby message', {username: this.props.username, message: this.state.message})
        this.setState({
            message: ''
        })
    }

    updateMessages = (data) => {
        const {message, username} = data
        this.setState({
            messages: [...this.state.messages,{username, message}]
        })
    }

    render(){
        const messages = this.state.messages.map((message, index) => (
            <div className='message-container' key={index}>
                <div className='message'>
                    <div id='username'>{message.username}: </div>
                    <div>{message.message}</div>
                </div>
            </div>
        ))

        var hidden = ''
        if(this.props.hideChat){
            hidden = 'show'
        }
        else{
            hidden = 'hidden-container'
        }
        return(
            <div id='lobby-chat-container' className={hidden}>
                <div className='title'>Lobby Chat</div>
                <div id='message-box'>
                    {messages}
                </div>
                <div id='chat-input'>
                    <input 
                        id='lobby-chat-input'
                        placeholder='Chat text'
                        onChange={this.handleChange}
                        name='message'
                        value={this.state.message}
                        onKeyPress={this.handleKeyPress}
                    />
                    <button className='button message-button' onClick={this.submitMessage}>Submit</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (reduxStore) => {
    const {username} = reduxStore
    return{username}
}

export default connect(mapStateToProps)(LobbyChat)