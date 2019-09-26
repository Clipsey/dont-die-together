import {connect} from 'react-redux';
import GameSession from './create_game_session';

const mapStateToProps = (state) => {
    return {
        state: state
    };
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//     }
// }

export default connect(mapStateToProps, null)(GameSession);