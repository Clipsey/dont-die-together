import axios from 'axios';

export const joinsession = (usersession) => {
    return axios.post('/api/users/session', usersession);
}