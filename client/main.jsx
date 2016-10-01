import React from 'react';
import {render} from 'react-dom';

import '../imports/startup/accounts-config.js';

import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
    render(
        <App/>, document.getElementById('render-target'));
});
