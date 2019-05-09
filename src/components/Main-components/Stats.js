import React, {Component} from 'react'
import {Link} from 'react-router-dom'
//import axios from 'axios'
import {Pie} from 'react-chartjs-2'
import {connect} from 'react-redux';

export class Stats extends Component{
    
    // componentDidMount(){
    //     axios.get('/api/stats').then(res => {
    //         const {wins, losses, draws, points} = res.data
    //         this.setState({
    //             wins, losses, draws, points
    //         })
    //     })
    // }
    
    render(){
        const {wins, losses, draws, points} = this.props
        
        if(wins === 0 && losses === 0 && draws ===0){
            return(
                <>
                    <h3>No record yet exists of your triumphs. Go forth and conquer, brave tactician!</h3>
                    <Link to='/main/lobby'>
                        <button>Back</button>
                    </Link>
                </>
            )
        }
        
        return(
            <>
                <h3>Stats</h3>
                <Pie
                    data={{
                        datasets: [{
                            data: [wins, losses, draws],
                            backgroundColor: ['blue', 'red', 'yellow']
                        }], 
                        labels: ['Wins', 'Losses', 'Draws']}}
                />
                <h4>Wins: {wins}</h4>
                <h4>Losses: {losses}</h4>
                <h4>Draws: {draws}</h4>
                <h4>Points: {points}</h4>
                <Link to='/main/lobby'>
                    <button>Back</button>
                </Link>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const {username, wins, losses, draws, points} = reduxState
    return {username, wins, losses, draws, points}
}

export default connect(mapStateToProps)(Stats)