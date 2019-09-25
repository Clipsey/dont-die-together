import {RECEIVE_ALL_USERS} from '../actions/user_session';

const UsersReducer = (state = {users: {}}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case RECEIVE_ALL_USERS:            
            newState = {};
            let userObjs = Object.values(action.users.data);
            userObjs.forEach( (user, idx) => {
                newState[user.email] = userObjs[idx];
            })
            console.log(newState);
            return newState;
            break;
        default:
            return state;
    }
}

export default UsersReducer;