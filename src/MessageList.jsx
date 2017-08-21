import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    return (
      <main className="messages">
       {this.props.messages.map((message)=>
          <Message username={message.username} content={message.content} key={message.id}/>
       )}
      </main>
    );
  }
}
export default MessageList;