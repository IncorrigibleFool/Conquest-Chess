import React, {Component} from 'react'
import PropTypes from "prop-types";
import Chess from "chess.js"
import Chessboard from 'chessboardjsx'
import io from 'socket.io-client'
import GameChat from './GameChat'

class HumanVsHuman extends Component{
    static propTypes = { children: PropTypes.func };

    constructor(props){
      super(props)
      this.state = {
        checkmate: false,
        check: false,
        draw: false,
        stalemate: false,
        lackMaterial: false,
        threefold: false,
        turn: 'w',
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
        history: []
      };
      this.socket = io.connect()
      this.socket.on('move', data => {
        this.game.move(data.move)
        this.setState(({ history, pieceSquare }) => ({
          checkmate: this.game.in_checkmate(),
          check: this.game.in_check(),
          draw: this.game.in_draw(),
          stalemate: this.game.in_stalemate(),
          lackMaterial: this.game.insufficient_material(),
          threefold: this.game.in_threefold_repetition(),
          turn: this.game.turn(),
          fen: this.game.fen(),
          history: this.game.history({ verbose: true }),
          squareStyles: squareStyling({ pieceSquare, history })
        }));
      })
    }

  componentDidMount() {
    this.game = new Chess();
    this.socket.emit('join room', {room: this.props.room})
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

    this.setState(({ history, pieceSquare }) => ({
      checkmate: this.game.in_checkmate(),
      check: this.game.in_check(),
      draw: this.game.in_draw(),
      stalemate: this.game.in_stalemate(),
      lackMaterial: this.game.insufficient_material(),
      threefold: this.game.in_threefold_repetition(),
      turn: this.game.turn(),
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }));

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

  onSquareClick = square => {
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

    this.setState({
      checkmate: this.game.in_checkmate(),
      check: this.game.in_check(),
      draw: this.game.in_draw(),
      stalemate: this.game.in_stalemate(),
      lackMaterial: this.game.insufficient_material(),
      threefold: this.game.in_threefold_repetition(),
      turn: this.game.turn(),
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      pieceSquare: ""
    });

    //broadcast move
    this.broadcastMove(move)
  };

  //undoes left clicking a square (onSquareClick function)
  onSquareRightClick = square => {
    this.setState(({history}) =>({
      squareStyles: squareStyling({ square, history}),
      //squareStyles: { [square]: { backgroundColor: "deepPink" } },
      pieceSquare: ""
    }))
  }

  //broadcast function
  broadcastMove = (move) => {
    this.socket.emit('move', {move, room: this.props.room})
  }

  render() {
    const { fen, dropSquareStyle, squareStyles, checkmate, check, draw, stalemate, lackMaterial, threefold, turn} = this.state;
    const {room} = this.props

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
      //GameChat props
      room,
      checkmate,
      check,
      draw,
      stalemate,
      lackMaterial,
      threefold,
      turn
    });
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

export default function PvPGame(props) {
  return (
    <>
      <HumanVsHuman
        room={props.match.params.room}
        color={props.location.state.color}
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
          room,
          checkmate,
          check,
          draw,
          stalemate,
          lackMaterial,
          threefold,
          turn
        }) => (
          <>
            <Chessboard
              id="humanVsHuman"
              width={520}
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
              checkmate={checkmate}
              check={check}
              draw={draw}
              stalemate={stalemate}
              lackMaterial={lackMaterial}
              threefold={threefold}
              turn={turn}
            />
          </>
        )}
      </HumanVsHuman>
    </>
  );
}