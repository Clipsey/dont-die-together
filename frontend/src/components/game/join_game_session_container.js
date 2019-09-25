import {connect} from 'react-redux';
import {receiveUsers} from '../../actions/user_session';
import GameSession from './join_game_session';

const mapStateToProps = (state) => {
    return {
        errors: state.errors.session,
        users: state.users.session
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        index: () => dispatch(receiveUsers())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameSession);