import React, {Component} from 'react'
import {Pie} from 'react-chartjs-2'
import {connect} from 'react-redux'
import './Stats.css'

export class Stats extends Component{
    constructor(){
        super()
        this.state = {
            wins: null,
            losses: null,
            draws: null,
            points: null,
        }
    }

    async componentDidMount(){
        await setTimeout(() => {
            const {wins, losses, draws, points} = this.props
            this.setState({
                wins,
                losses,
                draws,
                points
            })
        }, 200)
    }

    render(){
        const {wins, losses, draws} = this.state
        
        if(wins === 0 && losses === 0 && draws ===0){
            return(
                <div>
                    <h3>No record yet exists of your triumphs. Go forth and conquer, brave tactician!</h3>
                </div>
            )
        }
        
        return(
            <div id='stats-background'>
                <div id='chart-container'>
                    {/* <h2 id='stats-username'>{this.props.username}'s Career</h2> */}
                    <Pie
                        id='chart'
                        data={{
                            datasets: [{
                                data: [wins, losses, draws],
                                backgroundColor: ['blue', 'red', 'yellow']
                            }], 
                            labels: ['Wins', 'Losses', 'Draws']}}
                        options={{animation: {duration: 1500}, maintainAspectRatio: false, responsive: true}}
                    />
                </div>
                {/* <div>
                    <h4>Wins: {wins}</h4>
                    <h4>Losses: {losses}</h4>
                    <h4>Draws: {draws}</h4>
                </div> */}
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const {username, wins, losses, draws, points} = reduxState
    return {username, wins, losses, draws, points}
}

export default connect(mapStateToProps)(Stats)