//import react libs
import React from 'react';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class Task extends React.Component {
    //other functions
    _toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    _deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    _togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }

    //render functions
    render() {
        // Give tasks a different className when they are checked off, so that we can style them nicely in CSS
        const taskClassName = classnames({checked: this.props.task.checked, private: this.props.task.private});

        return (
            <li className={taskClassName}>
                <input type="checkbox" readOnly checked={this.props.task.checked} onClick={this._toggleChecked.bind(this)}/> {this.props.showPrivateButton
                    ? (
                        <button className="toggle-private" onClick={this._togglePrivate.bind(this)}>
                            {this.props.task.private
                                ? 'Private'
                                : 'Public'}
                        </button>
                    )
                    : ''}

                <span className="text">
                    <strong>{this.props.task.username}</strong>: {this.props.task.text}
                </span>

                <button className="delete" onClick={this._deleteThisTask.bind(this)}>
                    &times;
                </button>
            </li>
        );
    }
}

Task.propTypes = {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
};
