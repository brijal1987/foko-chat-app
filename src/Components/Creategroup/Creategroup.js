import React from "react";
import { ButtonToolbar, Button } from "react-bootstrap";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../../utils/constants";

let users = [];
let activeUser = JSON.parse(localStorage.getItem("user"));
let chatGroupIDs = JSON.parse(localStorage.getItem("chatGroupIDs"));

class Creategroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: [],
      usergroupData: [],
      isValueSelected: []
    };
    this.createGroup = this.createGroup.bind(this);
  }

  handleChange = (e, { value }) => {
    if (value.length <= 10) {
      this.setState({
        isValueSelected: value
      });
    }
    else{
      value = value.splice(-1,1);
    }
  };

  async componentDidMount() {
    users = await axios
      .get(`${API}/users/getuser`)
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          json.data.users.forEach(user => {
            let activeUser = JSON.parse(localStorage.getItem("user"));
            if (user.email !== activeUser.email) {
              const tempUser = {};
              tempUser.key = user._id;
              tempUser.text =
                user.email + (user.name ? " (" + user.name + ")" : "");
              tempUser.value = user.email;
              users.push(tempUser);
            }
          });
          return users;
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
    if (chatGroupIDs) {
      let usergroup = this._getGroupUsers();
      console.log(usergroup);
    }
    this.setState({
      userData: users
    });
  }

  createGroup() {
    const { isValueSelected } = this.state;
    isValueSelected.push(activeUser.email);
    axios
      .post(`${API}/users/addgroupusers`, { users: isValueSelected })
      .then(response => {
        return response;
      })
      .then(json => {
        if (json.data.success) {
          localStorage.removeItem("chatUserID");
          localStorage.setItem("chatGroupIDs", JSON.stringify(json.data.id));
          window.location.href = "/groupchat";
        } else {
          this.setState({ errorMessage: json.data.message });
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error });
      });
  }

  render() {
    const { userData, isValueSelected } = this.state;

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

              <h1 className="m-b-10 m-t-10">Create Group</h1>
              <div className="card m-t-10">
                <div className="card-header">User Selection</div>
                <div className="card-body">
                  <h5 className="card-title">Please Select User</h5>
                  <div className="card-text form-group">
                    <Dropdown
                      placeholder="Select Memebrs"
                      fluid
                      multiple
                      search
                      selection
                      options={userData}
                      onChange={this.handleChange}
                      defaultValue={this.state.isValueSelected}
                    />
                    <ButtonToolbar>
                      <Button
                        disabled={isValueSelected && isValueSelected.length < 1}
                        onClick={this.createGroup}
                        variant="info"
                        className="syncBtn m-t-10"
                      >
                        Start Chat with Group
                      </Button>
                    </ButtonToolbar>
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
export default Creategroup;
