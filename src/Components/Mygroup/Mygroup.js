import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../../utils/constants";

let userGroups = [];
let activeUser = JSON.parse(localStorage.getItem("user"));

class Mygroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mygroupData: []
    };
  }

  async componentDidMount() {
    userGroups = await axios
      .post(`${API}/users/getgroupusers`, { user: activeUser })
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          return json.data.usergroups;
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    this.setState({
      mygroupData: userGroups
    });
  }
  handleGroupClick(group) 
  {
    localStorage.setItem("chatGroupIDs", JSON.stringify(group.id));
    localStorage.setItem("chatUserIDs", JSON.stringify(group.users));
    window.location.href = "/groupchat";
  }

  render() {
    const { mygroupData } = this.state;

    return (
      <>
        <div className="chat">
          <div className="row">
            <div className="col-md-12 chat-history">
              <nav className="text-center">
                <Link className="page-link" to="/">
                  Back to Dashboard
                </Link>
              </nav>

              <h1 className="m-b-10 m-t-10">My Groups</h1>
              <div className="card m-t-10">
                <div className="card-body">
                  <div className="card-text form-group">
                    {mygroupData &&
                      mygroupData.length > 0 &&
                      mygroupData.map((mygroup, i) => {
                        // Return the element. Also pass key
                        return (
                          <li key={mygroup.id}>
                            <Link onClick={() => {
                              this.handleGroupClick(mygroup)
                            }}>
                              {mygroup.group}
                            </Link>
                          </li>
                        );
                      })}
                    {mygroupData.length === 0 && <span>No History Found</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Mygroup;
