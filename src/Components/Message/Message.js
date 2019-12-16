import React from "react";

export const Message = props => {
  const { successMessage, errorMessage } = props;
  return (
    <>
      {successMessage && (
        <div className="messages alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="messages alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Message;
