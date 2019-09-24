import React from 'react';
import {closeModal} from '../../actions/modal_actions';
import {connect} from 'react-redux';
import {login} from '../../actions/session_actions';
import Login from '../session/login_form';

function Modal({ modal, closeModal, login}) {

    if (!modal) {
        return null;
    }

    let component;
    switch (modal) {
        case 'Login':
            component = <Login login={login} closeModal={closeModal} />;
            break;
        default:
            return null;
    }

    return (
        <div className="modal-background" onClick={closeModal}>
            <div className="modal-child" onClick={e =>
                e.stopPropagation()}>
                {component}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        modal: state.ui.modal,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeModal: () => dispatch(closeModal()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);