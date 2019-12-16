import React from "react";
import "./Menu.scss";
import SideNav from "react-simple-sidenav";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";
import sidebarIcon from "../../images/sidebar.png";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNav: true
    };
  }

  closeSideNav = event => {
    this.setState({
      showNav: false
    });
  };

  handleClickOutside = event => {
    this.setState({
      showNav: true
    });
  };

  gotoHome = event => {
    window.location.href = "/";
  }

  getStyle() {
    let styles = {
      menuBar: {
        width: "100%",
        background: "#0AC",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        zIndex: 1000,
        top: 0,
        borderBottom: "5px solid #b451c3"
      }
    };
    return styles;
  }

  render() {
    let styles = this.getStyle();
    let activeUser = JSON.parse(localStorage.getItem("user"));
    const { logoutUser, userData, isUserGroup } = this.props;
    return (
      <>
        <div style={styles.menuBar}>
          <img
            className="menuItem"
            onClick={() => this.setState({ showNav: !this.state.showNav })}
            src={sidebarIcon}
            alt="Open"
          />
          <ul className="top-menu">
            <li className="logo">
              <Link to={{pathname:"/"}}>{APP_NAME}</Link>
            </li>
            <li className="link">
              {activeUser ? (
                <Link onClick={logoutUser}>Logout</Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
            {activeUser && activeUser.email ? (
              <li className="welcome">
                Welcome <span>{activeUser.email}</span>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        <div className="online-users">
          <SideNav
            title={isUserGroup ? "Group Users": "Users"}
            items={userData}
            showNav={this.state.showNav}
            onHideNav={() => this.setState({ showNav: true })}
          />
        </div>
      </>
    );
  }
}
export default Menu;
