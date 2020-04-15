import { fetch } from '../../utils/dataAccess';
import { USER_LOGIN_SUCCESS, USER_LOGIN_LOADING, USER_LOGIN_ERROR } from '../../constants.js';

export function loginSuccess(token) {
    return {
        type: USER_LOGIN_SUCCESS,
        token
    }
}

export function isLoading(loading) {
    return {
        type: USER_LOGIN_LOADING,
        loading
    }
}

export function loginError(error) {
    return {
        type: USER_LOGIN_ERROR,
        error
    }
}

export function login(values) {
    return dispatch => {
        dispatch(isLoading(true));
        dispatch(loginError(null));
        fetch('login_check', { method: 'POST',
            body: JSON.stringify(values)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            dispatch(loginSuccess(data['token']));
            dispatch(isLoading(false));
        })
        .catch(error => {
            dispatch(isLoading(false));
            dispatch(loginError(error.message));
        })
    }
}

export function logout() {
    window.sessionStorage.removeItem('jwtToken');
}