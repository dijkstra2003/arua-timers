import { combineReducers } from "redux";
import createBrowserHistory from 'history/createBrowserHistory';
import { reducer as form } from 'redux-form';
import { connectRouter } from 'connected-react-router';
// Import your reducers here 

const history = createBrowserHistory();

export default combineReducers({
    router: connectRouter(history),
    form,
    /* Add your reducers here */
})