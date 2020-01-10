import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import Page from './page.jsx';

const element = (
    <Router>
        <Page />
    </Router>
);
ReactDOM.render(element, document.getElementById('content'));

if (module.hot) {
    module.hot.accept();
}
