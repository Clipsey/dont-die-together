import React from 'react';
import {withRouter} from 'react-router-dom';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game_session.css';

class GameSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return(
            <div className="game-session-main">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <br />
                        Your session ID is:
                        <br />
                        23
                        {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                        <br />
                    </label>
                    <input type="submit" value="Enter Lobby" />
                    <br />
                    Join a different lobby instead
                </form>
            </div>
        )
    }

}

export default withRouter(GameSession);