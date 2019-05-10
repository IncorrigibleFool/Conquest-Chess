import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {} from '../../../redux/reducer'

export class Matchmaker extends Component{
    constructor(){
        super()
        this.state = {
            rooms: [],
            roomName: ''
        }
    }

    newRoom = () => {
        const roomsArr = this.state.rooms.slice()
        roomsArr.push(this.state.roomName)
        this.setState({
            roomName: '',
            rooms: roomsArr
        })
    }

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    render(){
        const rooms = this.state.rooms.map((room, i) =>(
            <div key={i}>
                <h3>{room.roomName}</h3>
                <button>Enter</button>
            </div>
        ))
        return(
            <>
                <h4>Matchmaker</h4>
                {rooms}
                <Link to='/main/game'>
                    <button>Game</button>
                </Link>
            </>
        )
    }
    
}

const mapDispatchToProps ={

}

export default connect(null, mapDispatchToProps)(Matchmaker)