import React, {Component} from 'react';
//add state and send both contsents
class Chatbar extends Component {
  render() {
  return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Username" onKeyDown={this.props.handleNewUser}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={this.props.handleNewMessage}/>
      </footer>
    );
  }

}
export default Chatbar;