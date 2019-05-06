import React, {Component} from 'react'

export default class Lobby extends Component{
    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.props.children}
            </div>
        )
    }
}