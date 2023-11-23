import {actionTypes} from '../constants/action-types'

export const setLogin = (payload) => {
    console.log('user in action',payload);
    return {
        type: actionTypes.LOGIN,
        payload: payload
    }
}

export const setLogout = (payload) => {
    return {
        type: actionTypes.LOGOUT,
        payload: payload
    }
}

export const setForgotEmailStatus = (payload) => {
    return {
        type: actionTypes.FORGOT_EMAIL_FIND,
        payload: payload
    }
}

export const setAllUsers = (payload) => {
    return {
        type: actionTypes.ALL_USERS,
        payload: payload
    }
}

