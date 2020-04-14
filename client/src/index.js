import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Route } from 'react-router-dom';
import {
  ConnectedRouter,
  routerMiddleware
} from 'connected-react-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import * as serviceWorker from './serviceWorker';
// Import your reducers and routes here 
import App from './App';
import reducers from './reducers';
import { tokenMiddleware } from './utils/middleware';
import history from './history';

const store = createStore(reducers, applyMiddleware(routerMiddleware(history), thunk, tokenMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <Route path="/" component={App}/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();