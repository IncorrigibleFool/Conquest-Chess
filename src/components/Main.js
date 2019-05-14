import React, {Component} from 'react'
import {connect} from 'react-redux'
import Unauthorized from './Main-components/Unauthorized'

export class Main extends Component{
    render(){
        if(!this.props.authenticated){
            return(
                <>
                    <Unauthorized/>
                </>
            )
        }
        
        return(
            <>
                <h1>Main</h1>
                {this.props.children}
            </>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const{authenticated} = reduxState
    return{authenticated}
}

export default connect(mapStateToProps)(Main)