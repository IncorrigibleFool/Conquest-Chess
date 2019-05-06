import React, {Component} from 'react'

export default class Game extends Component{
    render(){
        return(
            <div>
                <h3>Game</h3>
                {this.props.children}
            </div>
        )
    }
}