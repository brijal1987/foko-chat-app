import React from "react";
import { Link } from "react-router-dom";
import loginImage from "../../../images/login.png";
import Top from "../Top/Top";

let _email, _password, _name;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    };
  }

  handleregister = e => {
    const { registerUser } = this.props;
    e.preventDefault();
    registerUser(_name.value, _email.value, _password.value);
  };
  render() {
    return (
      <>
        <div className="login100-pic js-tilt" data-tilt>
          <img src={loginImage} alt="IMG" />
        </div>
        <form
          id="login-form"
          action=""
          onSubmit={this.handleregister}
          method="post"
          className="login100-form validate-form"
        >
          <Top title="Register" />

          <div
            className="wrap-input100 validate-input"
            data-validate="Name is required"
          >
            <input
              ref={input => (_name = input)}
              autoComplete="off"
              name="name"
              type="text"
              placeholder="Name"
              className="input100"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div
            className="wrap-input100 validate-input"
            data-validate="Valid email is required: ex@abc.xyz"
          >
            <input
              ref={input => (_email = input)}
              className="input100"
              autoComplete="off"
              type="text"
              name="email"
              placeholder="Email"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>
          <div
            className="wrap-input100 validate-input"
            data-validate="Password is required"
          >
            <input
              ref={input => (_password = input)}
              autoComplete="off"
              className="input100"
              type="password"
              name="pass"
              placeholder="Password"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-lock" aria-hidden="true"></i>
            </span>
          </div>
          <div className="container-login100-form-btn">
            <button className="login100-form-btn">Register</button>
          </div>

          <div className="text-center p-t-50">
            <Link className="txt2" to="/login">
              Login to your Account
              <i
                className="fa fa-long-arrow-right m-l-5"
                aria-hidden="true"
              ></i>
            </Link>
          </div>
        </form>
      </>
    );
  }
}

export default Register;
