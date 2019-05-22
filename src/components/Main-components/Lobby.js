import React, {Component} from 'react'
import './Lobby.css'
import Matchmaker from './Lobby-components/Matchmaker'
import LobbyChat from './Lobby-components/LobbyChat'

export default class Lobby extends Component{
    state = {
        hideChat: false
    }

    cycleButton = () => {
        this.setState({
            hideChat: !this.state.hideChat
        })
    }

    render(){
        return(
            <div id='lobby-background'>
                <Matchmaker hideChat={this.state.hideChat}/>
                <LobbyChat hideChat={this.state.hideChat}/>
                {!this.state.hideChat && <button onClick={this.cycleButton} className='button hidden-button'>Chat</button>}
                {this.state.hideChat && <button onClick={this.cycleButton} className='button hidden-button'>Games</button>}
            </div>
        )
    }
}