import { combineReducers } from "redux";
import createBrowserHistory from 'history/createBrowserHistory';
import { reducer as form } from 'redux-form';
import { connectRouter } from 'connected-react-router';
// Import your reducers here 
import user from './reducers/user/'; 
import monster from './reducers/monster/'; 
import map from './reducers/map/'; 
import login from './reducers/login/login';

const history = createBrowserHistory();

export default combineReducers({
    router: connectRouter(history),
    form,
    /* Add your reducers here */
	user,
	monster,
    map,
    login,
})