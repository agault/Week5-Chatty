import React, {Component} from 'react';
import Chatbar from './Chatbar.jsx';
import MessageList from './MessageList.jsx';
import {NotificationContainer, NotificationManager} from 'react-notifications';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"},
      oldUser: {name: "Anonymous"},
      messages: []
    // messages coming from the server will be stored here as they arrive
    };
  }
//CONNECTION TO SERVER WHEN PAGE LOADS
  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: "sdvsdf", username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);

      this.socket = new WebSocket(
        "ws://localhost:3001"
      )

      this.socket.onopen = function (event) {
        console.log("Connected to Server");

      }


      this.socket.onmessage = (messageEvent) => {
        const data = JSON.parse(messageEvent.data)
        console.log(data)
          switch(data.type) {
            case "incomingMessage":
              let newMessages = this.state.messages.concat(data)
              console.log(newMessages);
              this.setState({
                messages: newMessages
              });
              break;
            case "incomingNotification":
              let oldName = this.state.oldUser.name;

              this.setState({
                currentUser: {name: data.username},
                oldUser: {name: this.state.currentUser.name}
              });

              this.setState({
                messages: this.state.messages.concat({
                  content: oldName + " has changed their username to " + data.username,
                  id: data.id,
                  username: ""
                })
              })
              break;
            case "humanNumber":
              this.setState({
                humans:data.humans
              });
              console.log(data.humans)
              break;
          }
      }

  }
//ON ENTER SENDS MESSAGES TO SERVER
  handleNewMessage = (e) => {
     if (e.key === 'Enter') {
      const messageObject= {
        username: this.state.currentUser.name,
        content:e.target.value,
        type: "message"
      }
      console.log("sending message", messageObject)
      this.socket.send( JSON.stringify(messageObject) )
      console.log(this.state.currentUser.name)
    }

  }
//ON ENTER CHANGE USERNAME

  handleNewUser = (e) => {
    if (e.key === 'Enter') {
      const currentUser= {
        name: e.target.value
      }

      this.setState({ currentUser: currentUser });

      this.socket.send(
        JSON.stringify({
          type: "nameChange",
          username: e.target.value
        })
      )
    }
  }



// MESSAGE LISTS REQUIRES MESSAGES
  render() {
    console.log("this.state", this.state)
    return (
    <div>
    <nav className="navbar"><div className="Counter"> Number of humans creepin: {this.state.humans} </div>
        <a href="/" className="navbar-brand">Chatty</a>
    </nav>
    <div>
      <Chatbar handleNewUser={this.handleNewUser} handleNewMessage={this.handleNewMessage}/>
      <MessageList messages={this.state.messages} />
    </div>
    </div>
    );
  }
}
export default App;
