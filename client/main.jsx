//import react libs
import React from 'react';
import {render} from 'react-dom';

//import react components
import App from '../imports/ui/App.jsx';

//import configs
import '../imports/startup/client/accounts-config';

Meteor.startup(() => {
    render(
        <App/>, document.getElementById('render-target'));
});
