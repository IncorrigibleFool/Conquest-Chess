const initialState = {
    id: null,
    authenticated: false,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    wins: null,
    losses: null,
    draws: null,
    points: null
}

const AUTHENTICATE = 'AUTHENTICATE'
const UPDATE_ID = 'UPDATE_ID'
const UPDATE_USERNAME = 'UPDATE_USERNAME'
const UPDATE_NAME = 'UPDATE_NAME'
const UPDATE_STATS = 'UPDATE_STATS'
const UPDATE_EMAIL = 'UPDATE_EMAIL'

export function authenticate(bool){
    return {
        type: AUTHENTICATE,
        payload: bool
    }
}

export function updateId(id){
    return {
        type: UPDATE_ID,
        payload: id
    }
}

export function updateUsername(username){
    return {
        type: UPDATE_USERNAME,
        payload: username
    }
}

export function updateName(obj){
    return {
        type: UPDATE_NAME,
        payload: obj
    }
}

export function updateStats(obj){
    return {
        type: UPDATE_STATS,
        payload: obj
    }
}

export function updateEmail(email){
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}

export default function reducer(state = initialState, action){
    const{type, payload} = action
    switch(type){
        case AUTHENTICATE:
            return{...state, authenticated: payload}
        case UPDATE_ID:
            return {...state, id: payload}
        case UPDATE_USERNAME:
            return {...state, username: payload}
        case UPDATE_NAME:
            const {firstname, lastname} = payload
            return {...state, firstname, lastname}
        case UPDATE_EMAIL:
            return {...state, email: payload}
        case UPDATE_STATS:
            const {wins, losses, draws, points} = payload
            return {...state, wins, losses, draws, points}
        default:
            return state
    }
    
}