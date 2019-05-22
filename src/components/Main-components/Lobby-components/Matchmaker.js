import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'
import {connect} from 'react-redux'

export class Matchmaker extends Component{
    constructor(props){
        super(props)
        this.state = {
            rooms: [],
            roomName: '',
            color: 'b',
            chosenColor: 'w',
            nameTaken: false,
            tooLong: false
        }
        this.handleInput = this.handleInput.bind(this)
        this.socket = io.connect()
        this.socket.on('new room', data => {
            this.setState({
                rooms: [...this.state.rooms, data]
            })
        })
        this.socket.on('new player', data => {
            var tempArr = this.state.rooms
            tempArr[data.index].players.push(data.username)
            this.setState({
                rooms: tempArr
            })
        })
        this.socket.on('room update', data => {
            if(data.connections === undefined){
                const index = this.state.rooms.indexOf(data.room)
                let tempArr = this.state.rooms
                tempArr.splice(index, 1)
                this.setState({
                    rooms: tempArr
                })
                return
            }
            //catches instances where the server messes up and doesn't disconnect all listeners
            if(data.connections){
                if(data.connections.length === 1){
                    const index = this.state.rooms.indexOf(data.room)
                    let tempArr = this.state.rooms
                    tempArr.splice(index, 1)
                    this.setState({
                        rooms: tempArr
                    })
                }  
            }
        })
    }

    async componentDidMount(){
        const res = await axios.get('/api/rooms')
        this.setState({
            rooms: res.data
        })
    }

    componentWillUnmount(){
        this.socket.off('new room')
        this.socket.off('new player')
        this.socket.off('room update')
    }

    newRoom = () => {
        const {roomName : name, color} = this.state
        const {username} = this.props
        axios.put('/api/rooms', {name, color, players: [username]}).then((res) => {
            const length = res.data.length
            const room = res.data[length - 1]
            this.socket.emit('new room', room)
            this.socket.disconnect()
            this.socket.off('new room')
            this.socket.off('new player')
            this.socket.off('room update')
        }).catch(err => console.log(err))
    }

    enterRoom = (index) => {
        const {username} = this.props
        axios.put('/api/rooms/players', {username, index}).then(() => {
            this.socket.emit('new player', {username, index})
            this.socket.disconnect()
            this.socket.off('new room')
            this.socket.off('new player')
            this.socket.off('room update')
        }).catch(err => console.log(err))
    }

    async handleInput(event){
        await this.setState({
            [event.target.name]: event.target.value
        })
        if(this.state.roomName.length > 20){
            this.setState({
                tooLong: true
            })
        }
        if(this.state.roomName.length <= 20){
            this.setState({
                tooLong: false
            })
        }
        const exists = this.state.rooms.some(index => {
            return this.state.roomName === index.name
        })
        if(exists){
            this.setState({
                nameTaken: true
            })
        }else{
            this.setState({
                nameTaken: false
            })
        }
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
        const rooms = this.state.rooms.map((room, i) => {
            var color = ''
            var challengerColor = ''
            if(room.color === 'b'){
                color = 'White'
                challengerColor = 'Black'
            }
            if(room.color === 'w'){
                color = 'Black'
                challengerColor = 'White'
            }
            if(room.players.length >= 2)return(
                <div className='room' key={i}>
                    <h3>{room.name}</h3>
                    <h4>{`${room.players[0]} (${color}) vs ${room.players[1]} (${challengerColor})`}</h4>
                    <Link to={{pathname: `/main/game/${room.name}`, state: {color: null, player: false}}}>
                        <button className='matchmaker-button blue'>Watch</button>
                    </Link>
                </div>
            )
            return(
                <div className='room' key={i}>
                    <h3>{room.name}</h3>
                    <h4>{`${room.players[0]} (${color})`} seeking opponent</h4>
                    <Link to ={{pathname:`/main/game/${room.name}`, state: {color: room.color, player: true}}}>
                        <button className='matchmaker-button blue' onClick={() => this.enterRoom(i)}>Challenge</button>
                    </Link>
                </div>
            )
        })

        var hidden = ''
        if(!this.props.hideChat){
            hidden = 'show'
        }
        else{
            hidden = 'hidden-container'
        }
        return(
            <div id='matchmaker-container' className={hidden}>
                <div className='title'>Games</div>
                <div id='rooms-box'>
                    {this.state.rooms.length > 0 && rooms}
                    {this.state.rooms.length === 0 && <div>No available games.</div>}
                </div>
                <div id='room-maker'>
                    <div id='maker-options'>
                        <input
                            id='room-maker-input'
                            onChange={this.handleInput}
                            placeholder='Room name'
                            name='roomName'
                            value={this.state.roomName}
                        />
                        <select id='color-select' onChange={this.handleOption} name='color' value={this.state.color}>
                            <option value='b'>White</option>
                            <option value='w'>Black</option>
                        </select>
                    </div>
                    
                    {
                        !this.state.nameTaken && !this.state.tooLong &&
                        <Link to={{pathname: `/main/game/${this.state.roomName}`, state:{color: this.state.chosenColor, player: true}}}>
                            <button className='button' onClick={this.newRoom}>Create</button>
                        </Link>
                    }
                    {this.state.nameTaken && <p className='white-text'>Room already exists.</p>}
                    {this.state.tooLong && <p className='white-text'>Room name too long.</p>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const {username} = reduxState
    return {username}
}

export default connect(mapStateToProps)(Matchmaker)