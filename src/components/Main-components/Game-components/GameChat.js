import React, {Component} from 'react'

export default class GameChat extends Component{
    constructor(props){
        super(props)
        this.state = {
            message: ''
        }
    }

    createMessage = (event) => {
        event.preventDefault()
        const {message} = this.state
        this.props.newMessage(message)
        this.setState({
            message:''
        })
    }

    handleMessageUpdate = (event) => {
        this.setState({
            message: event.target.value
        })
    }
    
    render(){
        const messages = this.props.messages.map((message, index) => {
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

        return(
            <div id='game-chat-container'>
                <h3 id='turn'>
                    {this.props.turn === 'w' && <p>White's Turn</p>}
                    {this.props.turn === 'b' && <p>Black's Turn</p>}
                </h3>
                <div id='game-chat-box'>
                    <p>Left click on a piece then left click again on a legal square to move, or drag and drop.</p>
                    <p>Right click anywhere to cancel your selected square.</p>
                    <p>Promotions will always result in a queen.</p>
                    <p>Good luck!</p>
                    {messages}
                </div>
                <form id='game-chat-bar' onSubmit={this.createMessage}>
                    <input
                        placeholder='Chat text'
                        id='game-chat-input'
                        onChange={this.handleMessageUpdate}
                        value={this.state.message}
                    />
                </form>
            </div>
        )
    }
}