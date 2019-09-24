import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
// We'll create this soon
import App from './app';

import socketIOClient from 'socket.io-client';
import {emitSetup, onSetup} from '../util/sockets_util';

let socket;
let endpoint = 'localhost:5000';
if (process.env.NODE_ENV === 'development') {
  socket = socketIOClient(endpoint);
} else {
  socket = socketIOClient();
}

const emit = emitSetup(socket);
const subscribe = onSetup(socket);

// let socketMethods = {
//   emit,
//   on
// }

const Root = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <App emit={emit} subscribe={subscribe}/>
    </HashRouter>
  </Provider>
);

export default Root;