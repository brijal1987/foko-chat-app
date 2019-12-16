import React, { Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Auth/Login/Login";
import Register from "./Components/Auth/Register/Register";
import Startchat from "./Components/Startchat/Startchat";
import Groupchat from "./Components/Groupchat/Groupchat";
import Creategroup from "./Components/Creategroup/Creategroup";
import Mygroup from "./Components/Mygroup/Mygroup";
import { API } from "./utils/constants";
import { history } from "./utils/history";

import "./css/main.css";
import "./css/util.css";
import "./css/developer.css";
import axios from "axios";
import { PrivateRoute } from "./Components/Auth/Fakeauth/Fakeauth";
import Message from "./Components/Message/Message";
import Menu from "./Components/Menu/Menu";

let users = [];
let chatAPICall = "";
let activeUser = JSON.parse(localStorage.getItem("user"));
let chatGroupIDs = JSON.parse(localStorage.getItem("chatGroupIDs"));

class App extends Component {
  websocket;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      successMessage: "",
      errorMessage: "",
      userData: [],
      chatID: 0,
      activeUser,
      isUserGroup: false,
      newMessage: {}
    };
    this.child = React.createRef();
  }
  async componentDidMount() {
    if (activeUser && activeUser.email) {
      this.websocket = new WebSocket(
        "wss://5s3oiesin1.execute-api.us-east-1.amazonaws.com/development"
      );
      this.websocket.onopen = event => {
        this.websocket.send(
          JSON.stringify({
            service: "chat",
            action: "registration",
            data: {
              user: activeUser
            }
          })
        );
        this.websocket.onmessage = event => {
          this.updateChatHistory(event);
          // this.props.history.replace("/");
        };
      };
    }
    if (
      window.location.pathname === "/groupchat" ||
      (chatGroupIDs && window.location.pathname === "/creategroup")
    ) {
      this._getGroupUsers();
    } else {
      localStorage.removeItem("chatGroupIDs");
      this._getUsers();
    }
  }
  updateChatHistory = event => {
    console.log("called", event);
    let data = JSON.parse(event.data);
    if (data.action === "incoming") {
      this.setState({ newMessage: data.data });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.isLoggedIn !== this.state.isLoggedIn) {
      let activeUser = JSON.parse(localStorage.getItem("user"));
      if (this.state.isLoggedIn) {
        this.websocket = new WebSocket(
          "wss://5s3oiesin1.execute-api.us-east-1.amazonaws.com/development"
        );
        this.websocket.onopen = event => {
          this.websocket.send(
            JSON.stringify({
              service: "chat",
              action: "registration",
              data: {
                user: activeUser
              }
            })
          );
          this.websocket.onmessage = event => {};
        };
      }
      this._getUsers();
      this.setState({ activeUser: activeUser });
    }
  };

  async _getGroupUsers() {
    this.setState({
      isUserGroup: true
    });
    chatAPICall = `${API}/users/getgroups`;
    users = await axios
      .post(chatAPICall, { chatGroupIDs: chatGroupIDs })
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          let u = JSON.parse(json.data.users[0].users);
          users = [];
          u.forEach(user => {
            users.push(user);
          });
          return users;
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this.setState({
      userData: users
    });
    return users;
  }

  async _getUsers() {
    chatAPICall = `${API}/users/getuser`;
    users = await axios
      .get(chatAPICall)
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          users = [];
          json.data.users.forEach(user => {
            if (activeUser && user.email !== activeUser.email) {
              const element = (
                <Link
                  to={{ pathname: "/startchat", search: "?user=" + user.email }}
                  onClick={() => this.startChat(user.email)}
                >
                  {user.name ? user.name : user.email}
                </Link>
              );

              users.push(element);
            }
          });
          return users;
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this.setState({
      userData: users
    });
  }

  _clearMessges = () => {
    setTimeout(() => {
      this.setState({
        successMessage: "",
        errorMessage: ""
      });
    }, 4000);
  };

  _loginUser = (email, password) => {
    axios
      .post(`${API}/login`, { email: email, password: password })
      .then(response => {
        return response;
      })
      .then(async json => {
        if (json.data.success) {
          localStorage.setItem("user", JSON.stringify(json.data.user));
          this.setState({ isLoggedIn: true });
          // this.websocket = new WebSocket(
          //   "wss://5s3oiesin1.execute-api.us-east-1.amazonaws.com/development"
          // );
          // this.websocket.onopen = event => {
          //   this.websocket &&
          //     this.websocket.send(
          //       JSON.stringify({
          //         service: "chat",
          //         action: "registration",
          //         data: {
          //           user: json.data.user
          //         }
          //       })
          //     );
          //   this.websocket.onmessage = event => {
          //     console.log(event);
          //     window.location.href = "/";

          //     //this.props.history.replace("/");
          //   };
          // };

          window.location.href = "/";
        } else {
          this.setState({ errorMessage: json.data.message });
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this._clearMessges();
  };

  _registerUser = (name, email, password) => {
    axios
      .post(`${API}/register`, { email: email, password: password, name: name })
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          window.location.href = "/login";
          // history.push("/startchat");
        } else {
          this.setState({ errorMessage: json.data.message });
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this._clearMessges();
  };

  _logoutUser = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  startChat = chatID => {
    localStorage.removeItem("chatUserIDs");

    localStorage.setItem("chatUserID", JSON.stringify(chatID));
    this.child.current.handleClickOutside();
  };

  onClick = () => {
    if (!activeUser) {
      window.location.href = "/login";
    } else {
      this.child.current.handleClickOutside();
    }
  };

  sendMessage = message => {
    this.websocket &&
      this.websocket.send(
        JSON.stringify({
          service: "chat",
          action: "chat",
          data: {
            message: message
          }
        })
      );
  };
  _setSuccessMessage(message) {
    console.log("messa", message);
    this.setState({
      successMessage: message
    });
  }

  _setErrorMessage(message) {
    this.setState({
      errorMessage: message
    });
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          {this.state.activeUser && this.state.activeUser.email && (
            <Menu
              ref={this.child}
              logoutUser={this._logoutUser}
              {...this.props}
              {...this.state}
            />
          )}
          <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100 wrap-content">
                <Message {...this.props} {...this.state} />
                <Switch data="data">
                  <PrivateRoute
                    exact
                    path="/startchat"
                    component={Startchat}
                    sendMessage={this.sendMessage}
                    // render={props => (
                    //   <Startchat
                    //     sendMessage={this.sendMessage}
                    //   />
                    // )}
                    {...this.props}
                    {...this.state}
                    setSuccessMessage={this._setSuccessMessage}
                    newMessage={this.state.newMessage}
                  />
                  <PrivateRoute
                    exact
                    path="/groupchat"
                    sendMessage={this.sendMessage}
                    component={Groupchat}
                    getGroupUsers={this._getGroupUsers}
                    {...this.props}
                    {...this.state}
                    newMessage={this.state.newMessage}

                  />
                  <PrivateRoute
                    exact
                    path="/mygroups"
                    component={Mygroup}
                    {...this.props}
                    {...this.state}
                  />
                  <PrivateRoute path="/creategroup" component={Creategroup} />
                  <Route
                    exact
                    path="/"
                    render={props => (
                      <Home
                        {...props}
                        {...this.state}
                        logoutUser={this._logoutUser}
                        onClick={this.onClick}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={props =>
                      !localStorage.getItem("user") ? (
                        <Login
                          {...props}
                          {...this.state}
                          loginUser={this._loginUser}
                        />
                      ) : (
                        <Redirect
                          to={{
                            pathname: "/",
                            state: { from: props.location }
                          }}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/register"
                    render={props =>
                      !localStorage.getItem("user") ? (
                        <Register
                          {...props}
                          {...this.state}
                          registerUser={this._registerUser}
                        />
                      ) : (
                        <Redirect
                          to={{
                            pathname: "/",
                            state: { from: props.location }
                          }}
                        />
                      )
                    }
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
