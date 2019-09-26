import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import '../../style/stylesheets/reset.css';
import '../../style/stylesheets/app.css';
import '../../style/stylesheets/gameboy.css'

class GameSession extends React.Component {
    constructor(props) {
        super(props);
        this.bottom = React.createRef();
    }

    componentDidUpdate() {
        if (this.bottom.current) {
            this.bottom.current.scrollIntoView();
        }
    }

    render() {
        return(
            <div>
                <div className="gameboy"></div>
                <div ref={this.bottom} />
            </div>
        )
    }
}

export default withRouter(GameSession);