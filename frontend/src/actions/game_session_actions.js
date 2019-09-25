import * as APIUtil from '../util/session_utils';
import jwt_decode from 'jwt-decode';

export const RECEIEVE_CURRENT_SESSION = "RECEIVE_CURRENT_SESSION";

export const receiveCurrentSession = currentSession => ({
    type: RECEIEVE_CURRENT_SESSION,
    currentSession
});

export const signup = user => dispatch => (
    APIUtil.signup(user).then(() => (
        dispatch(receivesession())
    ), err => (
        dispatch(receiveErrors(err.response.data))
    ))
);