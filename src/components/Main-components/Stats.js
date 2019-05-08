import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {Pie} from 'react-chartjs-2'

export default class Stats extends Component{
    constructor(){
        super()
        this.state = {
            wins: 0,
            losses: 0,
            draws: 0,
            points: 0
        }
    }
    
    componentDidMount(){
        axios.get('/api/stats').then(res => {
            const {wins, losses, draws, points} = res.data
            this.setState({
                wins, losses, draws, points
            })
        })
    }
    
    render(){
        const {wins, losses, draws, points} = this.state
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