import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import LoginForm from './components/LoginForm'
import Register from './components/Register'
import RegisterForm from './components/RegisterForm'
import Lobby from './components/Lobby'
import Navbar from './components/Lobby-components/Navbar'
import LobbyMain from './components/Lobby-components/LobbyMain'

export default (
    <Switch>
        <Route exact path='/' component={() => (
            <Login>
                <LoginForm/>
            </Login>
        )}/>
        <Route path='/register' component={() => (
            <Register>
                <RegisterForm/>
            </Register>
        )}/>
        <Route path='/lobby' component={() => (
            <Lobby>
                <Switch>
                    <Route path/>
                        <Navbar>
                            <LobbyMain/>
                        </Navbar>
                </Switch>
            </Lobby>
        )}/>
    </Switch>
)
