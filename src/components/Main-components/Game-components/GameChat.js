import React, {Component} from 'react'
import io from 'socket.io-client'

export default class GameChat extends Component{
    constructor(props){
        super(props)
        this.state = {
            messages: [],
            message: '',
            blackTurn: false
        }
        this.socket = io.connect()
        this.socket.on('room message', data => this.updateMessages(data))
        this.socket.on('leave room', data => this.leftRoom(data))
        this.socket.on('move console', () => this.onMove())
    }

    componentDidMount(){
        this.socket.emit('join room', {room: this.props.room})
        window.addEventListener('beforeunload', () => {
            this.socket.emit('leave room', {room: this.props.room})
        })
    }

    onMove = () => {
        if(this.props.turn === 'w'){
            this.setState({
                blackTurn: false
            })
        }
        if(this.props.turn === 'b'){
            this.setState({
                blackTurn: true
            })
        }
        if(this.props.check && !this.props.checkmate){
            this.setState({
                messages: [...this.state.messages, {message: 'Check!'}]
            })
        }
        if(this.props.check && this.props.checkmate){
            this.setState({
                messages: [...this.state.messages, {message: 'Checkmate!'}]
            })
        }
        if(this.props.gameOver && this.props.turn !== this.props.color && !this.props.draw){
            this.setState({
                messages: [...this.state.messages, {message: 'Victory!'}]
            })
        }
        if(this.props.gameOver && this.props.turn === this.props.color && !this.props.draw){
            this.setState({
                messages: [...this.state.messages, {message: 'Defeat...'}]
            })
        }
        if(this.props.stalemate){
            this.setState({
                messages: [...this.state.messages, {message: 'Draw due to stalemate.'}]
            })
        }
        if(this.props.threefold){
            this.setState({
                messages: [...this.state.messages, {message: 'Draw due to threefold rule.'}]
            })
        }
        if(this.props.lackMaterial){
            this.setState({
                messages: [...this.state.messages, {message: 'Draw due to lack of material.'}]
            })
        }
        if(this.props.draw && !this.props.stalemate && !this.props.threefold && !this.props.lackMaterial){
            this.setState({
                messages: [...this.state.messages, {message: 'Draw due to 50-move rule.'}]
            })
        }
    }

    leftRoom = (data) => {
        if(data.username === undefined) return
        this.setState({
            messages: [...this.state.messages, {message: `${data.username} has left the room.`}]
        })
    }

    leaveRoom = () => {
        this.socket.emit('leave room', {room: this.props.room})
    }

    newMessage = (event) => {
        event.preventDefault()
        const {username, room} = this.props
        const {message} = this.state
        this.socket.emit('room message', {username, message, room})
        this.setState({
            message:''
        })
    }

    updateMessages = (data) => {
        const {message, username} = data
        this.setState({
            messages: [...this.state.messages,{username, message}]
        })
    }

    handleMessageUpdate = (event) => {
        this.setState({
            message: event.target.value
        })
    }
    
    render(){
        const messages = this.state.messages.map((message, index) => {
            if(message.username){
                return(
                    <div className='message' key={index}>
                        <div id='username'>{message.username}: </div>
                        <div>{message.message}</div>
                    </div>
                )
            }

            return(
                <div className='message' key={index}>
                    <p>{message.message}</p>
                </div>
            )
        })

        // var song = ''
        // var num = Math.floor(Math.random() * 4) + 1
        // if(num === 1){ song = 'destiny'}
        // if(num === 2){ song = 'duty'}
        // if(num === 3){ song = 'march'}
        // if(num === 4){ song = 'prelude'}

        return(
            <>
            <div id='game-chat-container'>
                <h3 id='turn'>
                    {!this.state.blackTurn && <p>White's Turn</p>}
                    {this.state.blackTurn && <p>Black's Turn</p>}
                </h3>
                <div id='game-chat-box'>
                    <p>Left click on a piece then left click again on a legal square to move, or drag and drop.</p>
                    <p>Right click anywhere to cancel your selected square.</p>
                    <p>Promotions will always result in a queen.</p>
                    <p>Good luck!</p>
                    {messages}
                </div>
                <form id='game-chat-bar' onSubmit={this.newMessage}>
                    <input
                        placeholder='Chat text'
                        id='game-chat-input'
                        onChange={this.handleMessageUpdate}
                        value={this.state.message}
                    />
                </form>
            </div>
            </>
        )
    }
}