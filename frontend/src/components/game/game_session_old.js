import React from 'react';
import {withRouter} from 'react-router-dom';
// import {createSession} from '../utils/'

class GameSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionId: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    
    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let sessionId = "";
        // createSession().then()
    }

    renderErrors() {
        return (
            <ul>
                {Object.keys(this.state.errors).map((error, i) => (
                    <li key={`error-${i}`}>
                        {this.state.errors[error]}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return(
            <div>
                <div className="">Join a Session</div>
                {/* <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type="text">
                            value={this.state.sessionId}
                            onChange={this.update('sessionId')}

                        </input>
                        <input type="submit" value="Submit">Submit</input>
                    </div>
                </form> */}
            </div>
        )
    }
}

export default withRouter(GameSession);