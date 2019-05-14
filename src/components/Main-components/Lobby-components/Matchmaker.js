import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'

export default class Matchmaker extends Component{
    constructor(){
        super()
        this.state = {
            rooms: [],
            roomName: ''
        }
        this.socket = io.connect()
        this.socket.on('new room', data => {
            this.setState({
                rooms: [...this.state.rooms, data.room]
            })
        })
    }

    async componentDidMount(){
        const res = await axios.get('/api/rooms')
        this.setState({
            rooms: res.data
        })
    }

    newRoom = () => {
        const {roomName : room} = this.state
        axios.put('/api/rooms', {room}).then(() => {
            this.socket.emit('new room', {room})
        }).catch(err => console.log(err))
    }

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    render(){
        const rooms = this.state.rooms.map((room, i) =>(
            <div key={i}>
                <h3>{room}</h3>
                <Link to ={{pathname:`/main/game/${room}`, state: {room}}}>
                    <button>Enter</button>
                </Link>
            </div>
        ))
        return(
            <>
                <h4>Matchmaker</h4>
                {rooms}
                <input
                    onChange={this.handleInput}
                    name='roomName'
                    value={this.state.roomName}
                />
                <select>
                    <option value='white'>White</option>
                    <option value='black'>Black</option>
                </select>
                <button onClick={this.newRoom}>Make Room</button>
            </>
        )
    }
    
}