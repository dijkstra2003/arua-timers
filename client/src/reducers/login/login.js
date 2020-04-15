import { combineReducers } from 'redux';
import { USER_LOGIN_SUCCESS, USER_LOGIN_LOADING, USER_LOGIN_ERROR } from '../../constants.js';

export function loginSuccess(state = {
    token: null,
    isAuthenticated: false
}, action) {
    switch(action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                token: action.token,
                isAuthenticated: true
            };
        default:
            return state
    }
}

export function isLoading(state = null, action) {
    switch(action.type) {
        case USER_LOGIN_LOADING:
            return action.loading;
        
            default:
            return state;
    }
}

export function loginError(state = null, action) {
    switch(action.type) {
        case USER_LOGIN_ERROR:
            return action.error;

        default:
            return state;
    }
}

export default combineReducers({loginSuccess, isLoading, loginError});