import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux';
import {authenticate, updateId, updateUsername, updateName, updateStats, updateEmail} from '../../redux/reducer'

export class Account extends Component{
    constructor(){
        super()
        this.state = {
            editedUsername: '',
            editedEmail: '',
            confirm: false,
            deleted: false,
            editMode: false,
            updateError: false,
            deleteError: false
        }
    }

    handleUpdate = (event) => {
        const {value} = event.target
        this.setState({
            [event.target.name]: value,
            updateError: false
        })
    }

    toggleUpdate = () => {
        this.setState({
            editMode: true
        })
    }

    cancelUpdate = () => {
        this.setState({
            editedUsername: '',
            editedEmail: '',
            editMode: false
        })
    }

    updateUsername = async (event) => {
        event.preventDefault()
        const {editedUsername : username} = this.state
        try{
            await axios.put('/auth/info/username', {username})
            this.props.updateUsername(username)
            this.setState({
                editedUsername: ''
            })
        }catch(err){
            this.setState({
                updateError: true
            })
        }
    }

    updateEmail = async (event) => {
        event.preventDefault()
        const {editedEmail : email} = this.state
        try{
            await axios.put('/auth/info/email', {email})
            this.props.updateEmail(email)
            this.setState({
                editedEmail: ''
            })
        }catch(err){
            this.setState({
                updateError: true
            })
        }
    }

    confirmDelete = () => {
        this.setState({
            confirm: true
        })
    }

    cancelDelete = () => {
        this.setState({
            confirm: false
        })
    }

    deleteAccount = async () => {
        this.setState({
            deleteError: false
        })
        try{
            await axios.delete('/auth/delete')
            this.props.authenticate(false)
            this.props.updateId(null)
            this.props.updateUsername('')
            this.props.updateName({firstname: '', lastname: ''})
            this.props.updateEmail('')
            this.props.updateStats({wins: null, losses: null, draws: null, points: null})
            this.setState({
                deleted: true
        })
        }catch(err){
            this.setState({
                deleteError: true
            })
        }   
    }
    
    render(){
        if(this.state.deleted){
            return(<Redirect to='/login'/>)
        }
        
        const {username, firstname, lastname, email} = this.props
        const {editedUsername, editedEmail} = this.state
        const {confirm, editMode, deleteError} = this.state

        return(
            <>
                <h4>{username}</h4>
                <h4>{email}</h4>
                <h4>{firstname} {lastname}</h4>
                {/* edit block */}
                <div>
                    {!editMode && <button onClick={this.toggleUpdate}>Change Info</button>}
                    {/* {editMode && <button>Change Password</button>} */}
                    {
                        editMode &&
                        <form>
                            <input
                                name='editedEmail'
                                placeholder='Email'
                                value={editedEmail}
                                onChange={this.handleUpdate}
                            />
                            <button onClick={this.updateEmail}>Change Email</button>
                            <input
                                name='editedUsername'
                                placeholder='Username'
                                value={editedUsername}
                                onChange={this.handleUpdate}
                            />
                            <button onClick={this.updateUsername}>Change Username</button>   
                        </form>
                    }
                    {editMode && <button onClick={this.cancelUpdate}>Cancel</button>}
                </div>
                {/* delete block */}
                <div>
                    {!confirm && <button onClick={this.confirmDelete}>Delete Account</button>}
                    {confirm && <h2>Are you sure you want to delete your account? This action is irreversible!</h2>}
                    {deleteError && <h3>There was an error in deleting your account. Please try again.</h3>}
                    {confirm && <button onClick={this.deleteAccount}>Confirm</button>}
                    {confirm && <button onClick={this.cancelDelete}>Cancel</button>}

                </div>
                <div>
                    <Link to='/main/lobby'>
                        <button>Back</button>
                    </Link>
                </div>
                
            </>
        )
    }
}

const mapStateToProps = (reduxState) => {
    const {id, username, firstname, lastname, email} = reduxState
    return {id, username, firstname, lastname, email}
}

const mapDispatchToProps = {
    authenticate,
    updateId,
    updateName,
    updateStats,
    updateUsername,
    updateEmail
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)