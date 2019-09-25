import {RECEIVE_ALL_USERS} from '../actions/user_session';

const UsersReducer = (state = {users: {}}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case RECEIVE_ALL_USERS:
            debugger
            newState.users = action.users.data;
            return newState;
            break;
        default:
            return state;
    }
}

export default UsersReducer;