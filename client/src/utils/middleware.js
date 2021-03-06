import { USER_LOGIN_SUCCESS } from '../constants.js';
import history from '../history';

export const tokenMiddleware = store => next => action => {
    switch(action.type) {
        case USER_LOGIN_SUCCESS:
            window.sessionStorage.setItem('jwtToken', action.token);
            history.push('/');
            break;
        default:
    }

    next(action);
}