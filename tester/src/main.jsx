import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App';

import mixpanel from 'mixpanel-browser';
try {
    mixpanel.init('fb1ff2b9066b748d068dc7baeec933da');
    mixpanel.track('enter');
} catch (err) {}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
