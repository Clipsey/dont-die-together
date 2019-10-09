import React from 'react';
import '../../style/stylesheets/game.css';
 
class Welcome extends React.Component {
    render() {
        return (
            <div>
                {/* <h4>Don't Die Together</h4> */}
                <div className="games">WASD to move, Q to switch guns, mouse to aim, click to shoot. Stay alive as long as possible and kill some zombies! Press Enter to start.</div>
            </div>
            );
    }
}

export default Welcome;