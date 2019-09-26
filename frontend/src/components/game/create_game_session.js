import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/game_session.css';
import '../../style/stylesheets/snowy.css'

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
                        {/* <br /> */}
                        <div className="game-text-text">Your username/session name is:</div>
                        {/* <br /> */}
                        <div className="game-text-text2">{`this.props.username`}</div>
                        {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                    </label>
                    <br />
                    <input className="game-text-submit" type="submit" value="Enter Your Lobby" />
                    <br />
                    <Link className="game-text-submit" to="/joingame">Join someone else's lobby instead</Link>
                </form>
            </div>
        )
    }

}

export default withRouter(GameSession);