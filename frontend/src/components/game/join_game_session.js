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
        // debugger
        event.preventDefault();
        // console.log(this.props)
        // debugger
        // this makes it so you fetch the index of all users before you call connectsocket
        this.props.index().then(() => {
            let username = this.state.value;
            // console.log(username)
            this.props.connectSocket(username);
            // give the name, connectsocket gets the sessionid using the name
        })
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
                    <br />
                    Host a lobby instead
                </form>
            </div>
        )
    }

}

export default withRouter(GameSession);