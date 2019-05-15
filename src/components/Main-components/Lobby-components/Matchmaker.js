import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'

export default class Matchmaker extends Component{
    constructor(){
        super()
        this.state = {
            rooms: [],
            roomName: '',
            color: 'b',
            chosenColor: 'w'
        }
        this.socket = io.connect()
        this.socket.on('new room', data => {
            this.setState({
                rooms: [...this.state.rooms, data]
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
        const {roomName : name, color} = this.state
        axios.put('/api/rooms', {name, color}).then(() => {
            this.socket.emit('new room', {name, color})
        }).catch(err => console.log(err))
    }

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleOption = (event) => {
        if(event.target.value === 'b'){
            this.setState({
                color: 'b',
                chosenColor: 'w'
            })
        }
        if(event.target.value === 'w'){
            this.setState({
                color: 'w',
                chosenColor: 'b'
            })
        }
    }
    
    render(){
        //add key players to room, if players = 2 render "game in progress" with a watch button
        //also add key username to render 'user1 vs user2'
        const rooms = this.state.rooms.map((room, i) =>(
            <div key={i}>
                <h3>{room.name}</h3>
                <Link to ={{pathname:`/main/game/${room.name}`, state: {color: room.color}}}>
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
                    placeholder='Room name'
                    name='roomName'
                    value={this.state.roomName}
                />
                <select onChange={this.handleOption} name='color' value={this.state.color}>
                    <option value='b'>White</option>
                    <option value='w'>Black</option>
                </select>
                <Link to={{pathname: `/main/game/${this.state.roomName}`, state:{color: this.state.chosenColor}}}>
                    <button onClick={this.newRoom}>Make Room</button>
                </Link>
            </>
        )
    }
    
}