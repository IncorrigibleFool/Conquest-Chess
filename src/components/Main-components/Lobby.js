import React, {Component} from 'react'
import './Lobby.css'

export default class Lobby extends Component{
    
    render(){
        return(
            <div id='lobby-background'>
                {this.props.children}
            </div>
        )
    }
}