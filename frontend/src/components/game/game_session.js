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
        // pass stuff to backend through here
        // you can make ajax calls and axios calls here
        event.preventDefault();
        let users = {
            value: this.state.values,
        };
        this.props.index(users);
    }

    render() {
        return(
            <div className="game-session-main">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <br />
                        Join by session number:
                        <br />
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                        <br />
                    </label>
                    <input type="submit" value="Enter Lobby" />
                    Host a lobby instead
                </form>
            </div>
        )
    }

}

export default withRouter(GameSession);