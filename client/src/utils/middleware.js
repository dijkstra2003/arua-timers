import { USER_LOGIN_SUCCESS } from '../constants.js';

export const tokenMiddleware = store => next => action => {
    switch(action.type) {
        case USER_LOGIN_SUCCESS:
            window.sessionStorage.setItem('jwtToken', action.token);
            break;
        default:
    }

    next(action);
}