import React, {Component} from 'react'

export default class Navbar extends Component{
    render(){
        return(
            <div>
                <h2>Navbar</h2>
                {this.props.children}
            </div>
        )
    }
}