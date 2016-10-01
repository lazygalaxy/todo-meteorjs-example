//import meteor libs
import {check} from 'meteor/check';

import {TaskCollection} from '../imports/api/collections';

Meteor.startup(() => {
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('tasks', function() {
        return TaskCollection.find({
            $or: [
                {
                    private: {
                        $ne: true
                    }
                }, {
                    owner: this.userId
                }
            ]
        });
    });
});

//meteor methods
Meteor.methods({
    'tasks.insert' (text) {
        check(text, String);
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        TaskCollection.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username
        });
    },
    'tasks.remove' (taskId) {
        check(taskId, String);

        const task = TaskCollection.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        TaskCollection.remove(taskId);
    },
    'tasks.setChecked' (taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = TaskCollection.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
        TaskCollection.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    },
    'tasks.setPrivate' (taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = TaskCollection.findOne(taskId);
        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        TaskCollection.update(taskId, {
            $set: {
                private: setToPrivate
            }
        });
    }
});
