import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import LoginForm from './components/LoginForm'
import Register from './components/Register'
import RegisterForm from './components/RegisterForm'
import Main from './components/Main'
import Navbar from './components/Main-components/Navbar'
import Lobby from './components/Main-components/Lobby'
import LobbyChat from './components/Main-components/Lobby-components/LobbyChat'
import Matchmaker from './components/Main-components/Lobby-components/Matchmaker'
import Stats from './components/Main-components/Stats'
import Account from './components/Main-components/Account'
import Game from './components/Main-components/Game'
import PvPGame from './components/Main-components/Game-components/PvPGame'
import GameChat from './components/Main-components/Game-components/GameChat'

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
        <Route path='/main' component={() => (
            <Main>
                <Switch>
                    <Route path='/main/lobby' component={() => (
                        <Navbar>
                            <Lobby>
                                <Matchmaker/>
                                <LobbyChat/>
                            </Lobby>
                        </Navbar>
                    )}/>
                    <Route path='/main/stats' component={() => (
                        <Navbar>
                            <Stats/>
                        </Navbar>
                    )}/>
                    <Route path='/main/account' component={() => (
                        <Navbar>
                            <Account/>
                        </Navbar>
                    )}/>
                    <Route path='/main/game' component={() => (
                        <Game>
                            <PvPGame/>
                            <GameChat/>
                        </Game>
                    )}/>    
                </Switch>
            </Main>
        )}/>
    </Switch>
)
