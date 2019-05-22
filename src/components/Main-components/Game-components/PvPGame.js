import React, {Component} from 'react'
import PropTypes from "prop-types";
import Chess from "chess.js"
import Chessboard from 'chessboardjsx'
import io from 'socket.io-client'
import GameChat from './GameChat'
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateStats} from '../../../redux/reducer'
import './Game.css'

class HumanVsHuman extends Component{
    static propTypes = { children: PropTypes.func };

    constructor(props){
      super(props)
      this.state = {
        gameOver: false,
        checkmate: false,
        check: false,
        draw: false,
        stalemate: false,
        lackMaterial: false,
        threefold: false,
        turn: 'w',
        prematureEnd: true,
        fen: "start",
        // square styles for active drop square
        dropSquareStyle: {},
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: "",
        // array of past game moves
        history: [],
        opponent: null,
        victory: false
      };
      this.leaveRoom = this.leaveRoom.bind(this)
      this.leftRoom = this.leftRoom.bind(this)
      this.handleGameResult = this.handleGameResult.bind(this)
      this.onSquareClick = this.onSquareClick.bind(this)
      this.resolveMove = this.resolveMove.bind(this)
      this.socket = io.connect()
      this.socket.on('move', data => {
        this.game.move(data.move)
        this.resolveMove()
      })
      this.socket.on('join room', data => this.joinRoom(data))
      this.socket.on('join response', data => this.joinResponse(data))
      this.socket.on('leave room', data => this.leftRoom(data))
    }

  componentDidMount() {
    this.game = new Chess();
    this.socket.emit('join room', {room: this.props.room, username: this.props.username, id: this.props.id})
    window.addEventListener('beforeunload', () => {
      this.socket.emit('leave room', {room: this.props.room, username: this.props.username, id: this.props.id})
      this.socket.disconnect()
    })
  }

  async resolveMove(){
    await this.setState(({ history, pieceSquare }) => ({
      gameOver: this.game.game_over(),
      checkmate: this.game.in_checkmate(),
      check: this.game.in_check(),
      draw: this.game.in_draw(),
      stalemate: this.game.in_stalemate(),
      lackMaterial: this.game.insufficient_material(),
      threefold: this.game.in_threefold_repetition(),
      turn: this.game.turn(),
      prematureEnd: !this.game.game_over(),
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }))
    this.handleGameResult()
  }

  joinRoom = (data) => {
    if(data.username === undefined) return
    if(this.state.opponent !== null) return
    if(!this.props.player) return
    this.setState({
      opponent: data.id
    })
    this.socket.emit('join response', {room: this.props.room, username: this.props.username, id: this.props.id})
  }

  joinResponse = (data) => {
    if(data.username === undefined) return
    if(this.state.opponent !== null) return
    if(!this.props.player) return
    this.setState({
      opponent: data.id
    })
  }

  //penalizes opponent who left early with a loss and awards remaining player a win
  async leftRoom(data){
    if(!this.props.player) return
    if(this.state.prematureEnd && this.state.opponent === data.id){
      await axios.put('/api/stats/penalty', {id: data.id})
      var {wins, losses, draws, points} = this.props
      wins += 1
      await axios.put('/api/stats/update', {wins, losses, draws, points})
      this.props.updateStats({wins, losses, draws, points})
    }
  }

  async leaveRoom(){
    await this.socket.emit('leave room', {room: this.props.room, username: this.props.username, id: this.props.id})
    this.socket.disconnect()
    return <Redirect to='/main/lobby'/>
  }

  //updates stats on win, loss or draw and updates state to display appropriate image for each scenario
  async handleGameResult(){
    if(this.state.gameOver){
      if(this.state.checkmate && this.state.turn !== this.props.color){
        let {wins, losses, draws, points} = this.props
        wins += 1
        await axios.put('/api/stats/update', {wins, losses, draws, points})
        this.props.updateStats({wins, losses, draws, points})
        this.setState({
          victory: true
        })
      }
      if(this.state.checkmate && this.state.turn === this.props.color){
        let {wins, losses, draws, points} = this.props
        losses += 1
        await axios.put('/api/stats/update', {wins, losses, draws, points})
        this.props.updateStats({wins, losses, draws, points})
      }
      if(this.state.draw){
        let {wins, losses, draws, points} = this.props
        draws += 1
        await axios.put('/api/stats/update', {wins, losses, draws, points})
        this.props.updateStats({wins, losses, draws, points})
      }
    }
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          // ...squareStyling({
          //   history: this.state.history,
          //   pieceSquare: this.state.pieceSquare
          // })
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: {...highlightStyles }
    }));
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    const turn = this.game.turn()
    if(turn !== this.props.color) return
    
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) return;

    this.resolveMove()

    //broadcast move to socket
    this.broadcastMove(move)
  };

  onMouseOverSquare = square => {
    const turn = this.game.turn()
    if(turn !== this.props.color) return

    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = square => this.removeHighlightSquare(square);

  // highlight dragged over squares
  onDragOverSquare = () => {
    this.setState({
      dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  async onSquareClick(square){
    const turn = this.game.turn()
    if(turn !== this.props.color) return
    
    this.setState(({ history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square
    }));

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) return;

    await this.setState({
      gameOver: this.game.game_over(),
      checkmate: this.game.in_checkmate(),
      check: this.game.in_check(),
      draw: this.game.in_draw(),
      stalemate: this.game.in_stalemate(),
      lackMaterial: this.game.insufficient_material(),
      threefold: this.game.in_threefold_repetition(),
      turn: this.game.turn(),
      prematureEnd: !this.game.game_over(),
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
    })
    
    this.handleGameResult()

    //broadcast move
    this.broadcastMove(move)
  };

  //undoes left clicking a square (onSquareClick function)
  onSquareRightClick = square => {
    this.setState(({history}) =>({
      squareStyles: squareStyling({ square, history}),
      pieceSquare: ""
    }))
  }

  //broadcast function
  broadcastMove = (move) => {
    this.socket.emit('move', {move, room: this.props.room})
  }

  render() {
    const { fen, dropSquareStyle, squareStyles, gameOver, checkmate, check, draw, stalemate, lackMaterial, threefold, turn, opponent} = this.state;
    const {room, username, player, color} = this.props

    if(opponent === null && player){
      return(
        <div id='waiting-screen'>
          <audio src={require("../../../assets/preparations.mp3")} autoPlay loop/>
          <h1>Awaiting opponent</h1>
          <div className='balls'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <Link to='/main/lobby'>
            <button id='cancel-button' className='button' onClick={this.leaveRoom}>Cancel</button>
          </Link>
        </div>
      )
    }
    else{
      return this.props.children({
        squareStyles,
        position: fen,
        onMouseOverSquare: this.onMouseOverSquare,
        onMouseOutSquare: this.onMouseOutSquare,
        onDrop: this.onDrop,
        dropSquareStyle,
        onDragOverSquare: this.onDragOverSquare,
        onSquareClick: this.onSquareClick,
        onSquareRightClick: this.onSquareRightClick,
        leaveRoom: this.leaveRoom,
        //GameChat props
        room,
        username,
        gameOver,
        checkmate,
        check,
        draw,
        stalemate,
        lackMaterial,
        threefold,
        turn,
        color
      });
    }
  }
}

const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;
  
    return {
      [pieceSquare]: { backgroundColor: "rgba(63, 155, 191, 1)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

export function PvPGame(props) {
  var song = ''
  var num = Math.floor(Math.random() * 4) + 1
  if(num === 1){ song = 'destiny'}
  if(num === 2){ song = 'duty'}
  if(num === 3){ song = 'march'}
  if(num === 4){ song = 'prelude'}
  
  return (
    <>
      <HumanVsHuman
        updateStats={props.updateStats}
        room={props.match.params.room}
        username={props.username}
        id={props.id}
        color={props.location.state.color}
        player={props.location.state.player}
        wins={props.wins}
        losses={props.losses}
        draws={props.draws}
        points={props.points}
      >
        {({
          position,
          onDrop,
          onMouseOverSquare,
          onMouseOutSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
          leaveRoom,
          room,
          username,
          gameOver,
          checkmate,
          check,
          draw,
          stalemate,
          lackMaterial,
          threefold,
          turn,
          color
        }) => (
          <div id='game-container'>
            <div
              gameOver={gameOver}
              check={check}
              checkmate={checkmate}
              turn={turn}
              color={color}
              leaveRoom={leaveRoom}
            >
              {!gameOver && !check && <audio src={require(`../../../assets/${song}.mp3`)} autoPlay loop/>}
              {check && !checkmate && <audio src={require('../../../assets/danger.mp3')} autoPlay loop/>}
              {gameOver && turn !== color && <audio src={require('../../../assets/victory.mp3')} autoPlay loop/>}
              {
                gameOver && turn !== color && 
                <div className='popup'>
                  <div className='popup-inner'>
                    <h1>Victory!</h1>
                      <button onClick={leaveRoom} className='button'>Return</button>
                  </div>
                </div>
              }
              {gameOver && turn === color && <audio src={require('../../../assets/defeat.mp3')} autoPlay loop/>}
              {
                gameOver && turn === color && 
                <div className='popup'>
                  <div className='popup-inner'>
                    <h1>Defeat...</h1>
                      <button onClick={leaveRoom} className='button'>Return</button>
                  </div>
                </div>
              }
            </div>
            <Chessboard
              id="humanVsHuman"
              width={560}
              position={position}
              onDrop={onDrop}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
              boardStyle={{
                borderRadius: "5px",
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
              }}
              squareStyles={squareStyles}
              dropSquareStyle={dropSquareStyle}
              onDragOverSquare={onDragOverSquare}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
            />
            <GameChat
              id="gameChat"
              room={room}
              username={username}
              gameOver={gameOver}
              checkmate={checkmate}
              check={check}
              draw={draw}
              stalemate={stalemate}
              lackMaterial={lackMaterial}
              threefold={threefold}
              turn={turn}
              color={color}
            />
          </div>
        )}
      </HumanVsHuman>
    </>
  );
}

const mapStateToProps = (reduxState) => {
  const {username, id, wins, losses, draws, points} = reduxState
  return {username, id, wins, losses, draws, points}
}

const mapDispatchToProps = {
  updateStats
}

export default connect(mapStateToProps, mapDispatchToProps)(PvPGame)