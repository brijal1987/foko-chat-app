import React from 'react';
import { render } from "react-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, withRouter } from "react-router-dom";


const AppContainer = withRouter(props => <App {...props} />);
render(
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>,

  document.getElementById("root")
);
serviceWorker.unregister();
