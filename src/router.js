import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import LoginForm from './components/LoginForm'
import Register from './components/Register'
import RegisterForm from './components/RegisterForm'
import Main from './components/Main'
import Navbar from './components/Main-components/Navbar'
import Lobby from './components/Main-components/Lobby'
import Stats from './components/Main-components/Stats'
import Account from './components/Main-components/Account'
import PvPGame from './components/Main-components/Game-components/PvPGame'

export default (
    <Switch>
        <Route exact path='/'>
            <Redirect to='/login'/>
        </Route>
        <Route path='/login' component={() => (
            <Login>
                <LoginForm/>
            </Login>
        )}/>
        <Route exact path='/register' component={() => (
            <Register>
                <RegisterForm/>
            </Register>
        )}/>
        <Route exact path='/main' component={() => (
            <Redirect to='/main/lobby'/>
        )}/> 
        <Route path='/main/lobby' component={() => (
            <Main>
                <Navbar>
                    <Lobby/>
                </Navbar>
            </Main>
        )}/>
        <Route path='/main/stats' component={() => (
            <Main>
                <Navbar>
                    <Stats/>
                </Navbar>
            </Main>
        )}/>
        <Route path='/main/account' component={() => (
            <Main>
                <Navbar>
                    <Account/>
                </Navbar>
            </Main>
        )}/>
        <Route path='/main/game/:room' component={(props) => (
            <Main>
                <PvPGame {...props}/>
            </Main>
        )}/>    
    </Switch>
)