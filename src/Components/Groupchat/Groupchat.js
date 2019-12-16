import React from "react";
import axios from "axios";
import { API } from "../../utils/constants";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import moment from "moment";

let userhistory = [];
let chatGroupIDs = JSON.parse(localStorage.getItem("chatGroupIDs"));
let activeUser = JSON.parse(localStorage.getItem("user"));

class Groupchat extends React.Component {
  websocket;
  constructor(props) {
    super(props);

    this.state = {
      userHistoryData: [],
      sendMessage: "",
      chatUserID: ""
    };
    this.handleDeleteChat = this.handleDeleteChat.bind(this);
    this.getGroupHistory = this.getGroupHistory.bind(this);
  }
  async componentDidMount() {
    if (!chatGroupIDs) window.location.href = "/";
    this.getGroupHistory();
  }

  async getGroupHistory() {
    userhistory = await axios
      .post(`${API}/users/getgroupuserhistory`, {
        chatGroupIDs: chatGroupIDs
      })
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          return json.data.users;
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this.setState({
      userHistoryData: userhistory
    });
  }
  async handleDeleteChat(id) {
    const { setSuccessMessage } = this.props;
    confirmAlert({
      title: "Confirm to Delete Chat",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .post(`${API}/users/deletegroupuserhistory`, {
                id: id
              })
              .then(response => {
                return response;
              })
              .then(json => {
                if (json.data.success) {
                  setSuccessMessage(json.data.message);
                }
              })
              .catch(error => {
                this.setState({ errorMessage: error });
              });
            this.getGroupHistory();
          }
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location.search !== this.props.location.search) {
      this.getGroupHistory();
    }
    if (prevProps.newMessage.message !== this.props.newMessage.message) {
      console.log(this.props.newMessage);
      const userHistoryData = [
        ...this.state.userHistoryData,
        this.props.newMessage
      ];
      this.setState({ userHistoryData: userHistoryData }, () => {
        this.scrollRef.scrollTop = this.scrollRef.scrollHeight;
      });
    }
  };

  onChangeHandler = event => {
    if (event && event.target) {
      this.setState({ sendMessage: event.target.value });
    }
  };

  async handleGroupHistory(newRecord) {
    await axios.post(`${API}/users/addgrouphistory`, newRecord);
  }

  submitHandler = event => {
    let activeUser = JSON.parse(localStorage.getItem("user"));
    event.preventDefault();
    userhistory = [...this.state.userHistoryData];

    let newRecord = {
      fromID: activeUser.email,
      groupID: chatGroupIDs,
      date: moment().format("YYYY-MM-DD[T]hh:mm:ss.SSS[Z]"),
      message: this.state.sendMessage
    };
    this.handleGroupHistory(newRecord);

    console.log(newRecord);
    userhistory.push(newRecord);
    this.setState({ userHistoryData: userhistory, sendMessage: "" }, () => {
      this.scrollRef.scrollTop = this.scrollRef.scrollHeight;
    });

    this.props.sendMessage(newRecord);
  };

  render() {
    const { userHistoryData } = this.state;
    return (
      <>
        <div className="chat">
          <div className="row">
            <div className="col-md-12 chat-history">
              <ul
                className="chat-ul"
                ref={ref => {
                  this.scrollRef = ref;
                }}
              >
                {chatGroupIDs && <h1>Group {chatGroupIDs}</h1>}
                <hr></hr>
                {userHistoryData &&
                  userHistoryData.length > 0 &&
                  userHistoryData.map((userhistory, i) => {
                    // Return the element. Also pass key
                    return (
                      <li
                        key={
                          userhistory.fromID +
                          userhistory.message +
                          new Date().toDateString()
                        }
                      >
                        <div className="message-data">
                          <span className="message-data-name">
                            <i className="fa fa-circle you"></i>
                            {activeUser.email === userhistory.fromID
                              ? "You"
                              : userhistory.fromID}
                          </span>
                        </div>
                        <div className="message you-message">
                          {userhistory.message}
                          {activeUser.email === userhistory.fromID && (
                            <button
                              className="delete-chat"
                              onClick={() => {
                                this.handleDeleteChat(userhistory._id);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                {userHistoryData.length === 0 && (
                  <li className="no_history">No History Found</li>
                )}
              </ul>
              <div className="row my-2 pb-4">
                <div className="col-md-12">
                  <form onSubmit={this.submitHandler}>
                    <div className="input-group">
                      <input
                        id="btn-input"
                        type="text"
                        className="form-control input-sm"
                        value={this.state.sendMessage}
                        onChange={event => {
                          this.onChangeHandler(event);
                        }}
                        placeholder="Type your message here..."
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="submit"
                          id="button-addon2"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Groupchat;
