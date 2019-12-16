import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import chatImage from "../../images/chat.png";
import groupImage from "../../images/create-group-button.png";
import myGroupImage from "../../images/group.png";

class Home extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <>
        <div className=" chat">
          <div className="row">
            <div className="col-md-12 chat-history">
              <ul className="home">
                <Link to="#" onClick={onClick}>
                  <li>
                    <img src={chatImage} alt="Start Chat" />
                    <div className="title-box p-t-10">Start Chat</div>
                  </li>
                </Link>
                <Link to="/creategroup">
                  <li>
                    <img src={groupImage} alt="Create Group" />
                    <div className="title-box p-t-10">Create Group</div>
                  </li>
                </Link>
                <Link to="/mygroups">
                  <li>
                    <img src={myGroupImage} alt="My Group" />
                    <div className="title-box p-t-10">My Groups</div>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
