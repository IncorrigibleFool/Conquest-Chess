import React, {Component} from 'react'

export default class Lobby extends Component{
    render(){
        return(
            <div>
                <h3>Lobby</h3>
                {this.props.children}
            </div>
        )
    }
}