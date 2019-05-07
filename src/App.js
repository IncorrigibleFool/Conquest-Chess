import React from 'react';
import {Provider} from 'react-redux'
import {HashRouter} from 'react-router-dom'
import router from './router'
import store from './redux/store'


function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        {router}
      </HashRouter>
    </Provider>
  );
}

export default App;

/*
installed: 
socket.io
axios
massive
react-router-dom
dotenv
express
express-session
bcryptjs
redux
react-redux
chart.js
react-chartjs-2
chessboard.jsx
chess.js
*/

//PvPGame component: contains human vs human chess