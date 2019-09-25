import {RECEIVE_ALL_USERS} from '../actions/user_session';

const UsersReducer = (state = {users: {}}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch (action.type) {
        case RECEIVE_ALL_USERS:
            let arr = Object.values(action.users.data).map((object) => object.email)
            // make it so the object in the state is a key of the usernames and has all the data associated with that username
            let users = {};
            Object.keys(action.users.data).forEach(ele => {
                users[arr[parseInt(ele)]] = action.users.data[ele]
            })
            newState.users = users;
            return newState;
        default:
            return state;
    }
}

export default UsersReducer;