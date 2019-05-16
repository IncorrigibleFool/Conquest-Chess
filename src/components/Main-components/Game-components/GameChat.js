import React, {Component} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'

export class GameChat extends Component{
    constructor(props){
        super(props)
        this.state = {
            messages: [],
            message: '',
            blackTurn: false
        }
        this.socket = io.connect()
        this.socket.on('room message', data => this.updateMessages(data))
    }

    componentDidMount(){
        this.socket.emit('join room', {room: this.props.room})
        window.addEventListener('beforeunload', () => {
            this.socket.emit('leave room', {room: this.props.room})
        })
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
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
                    <div key={index}>
                        <h5>{message.username}: </h5>
                        <p>{message.message}</p>
                    </div>
                )
            }

            return(
                <div key={index}>
                    <p>{message.message}</p>
                </div>
            )
        })

        return(
            <>
                <h3>
                    {!this.state.blackTurn && <p>White's turn</p>}
                    {this.state.blackTurn && <p>Black's turn</p>}
                </h3>
                <div>
                    <p>Left click on a piece then left click again on a legal square to move, or drag and drop.</p>
                    <p>Right click anywhere to cancel your selected square.</p>
                    <p>Promotions will always result in a queen.</p>
                    <p>Good luck!</p>
                    {messages}
                    <form onSubmit={this.newMessage}>
                        <input
                            onChange={this.handleMessageUpdate}
                            value={this.state.message}
                        />
                    </form>    
                </div>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const {username} = reduxState
    return {username}
}

export default connect(mapStateToProps)(GameChat)