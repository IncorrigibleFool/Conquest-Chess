import React, {Component} from 'react'

export default class Game extends Component{
    render(){
        return(
            <>
                <h3>Game</h3>
                {this.props.children}
            </>
        )
    }
}