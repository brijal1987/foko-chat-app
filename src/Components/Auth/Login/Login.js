import React from "react";
import { Link } from "react-router-dom";
import loginImage from "../../../images/login.png";
import Top from "../Top/Top";

let _email, _password;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    };
  }

  handleLogin = e => {
    const { loginUser } = this.props;
    e.preventDefault();
    loginUser(_email.value, _password.value);
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
          onSubmit={this.handleLogin}
          method="post"
          className="login100-form validate-form"
        >
          <Top title="Login" />
          <div
            className="wrap-input100 validate-input"
            data-validate="Valid email is required: ex@abc.xyz"
          >
            <input
              className="input100"
              ref={input => (_email = input)}
              autoComplete="off"
              id="email-input"
              name="email"
              type="text"
              placeholder="email"
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
              className="input100"
              ref={input => (_password = input)}
              autoComplete="off"
              id="password-input"
              name="password"
              type="password"
              placeholder="password"
            />

            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <i className="fa fa-lock" aria-hidden="true"></i>
            </span>
          </div>
          <div className="container-login100-form-btn">
            <button className="login100-form-btn">Login</button>
          </div>

          <div className="text-center p-t-50">
            <Link className="txt2" to="/register">
              Create your Account
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

export default Login;

//export default Login;
