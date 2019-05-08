import React, {Component} from 'react'

export default class Lobby extends Component{
    render(){
        return(
            <>
                <h3>Lobby</h3>
                {this.props.children}
            </>
        )
    }
}