//import react libs
import React from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';

//import react components
import Accounts from './Accounts.jsx';
import Task from './Task.jsx';

import {TaskCollection} from '../api/collections';

// App component - represents the whole app
class App extends React.Component {
    constructor(props) {
        super(props);

        this.props.test123 = "vangos";

        this.state = {
            hideCompleted: false
        };
    }

    //event functions
    _handleSubmit(event) {
        //prevent the pafe from refreshing
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('tasks.insert', text);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    //other functions
    _toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    //render functions
    _renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return (<Task key={task._id} task={task} showPrivateButton={showPrivateButton}/>);
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this._toggleHideCompleted.bind(this)}/>
                        Hide Completed Tasks
                    </label>

                    <Accounts/> {this.props.currentUser
                        ? <form className="new-task" onSubmit={this._handleSubmit.bind(this)}>
                                <input type="text" ref="textInput" placeholder="Type to add new tasks"/>
                            </form>
                        : ''}
                </header>

                <ul>
                    {this._renderTasks()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    tasks: React.PropTypes.array.isRequired,
    incompleteCount: React.PropTypes.number.isRequired,
    currentUser: React.PropTypes.object
};

export default createContainer(() => {
    Meteor.subscribe('tasks');
    console.info("create constructor running " + Meteor.user());

    return {
        tasks: TaskCollection.find({}, {
            sort: {
                createdAt: -1
            }
        }).fetch(),
        incompleteCount: TaskCollection.find({
            checked: {
                $ne: true
            }
        }).count(),
        currentUser: Meteor.user()
    };
}, App);
