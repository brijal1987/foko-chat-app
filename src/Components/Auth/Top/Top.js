import React from 'react';

class Top extends React.Component {

  render() {
    return (
      <>
        <span className="login100-form-title">
          {this.props.title}
        </span>
      </>
    );
  }
}

export default Top;