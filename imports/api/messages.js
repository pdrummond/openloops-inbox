import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Subjects } from './subjects.js';

export const Messages = new Mongo.Collection('Messages');

if (Meteor.isServer) {
    Meteor.publish('messages', function messagesPublication(subjectId) {
        return Messages.find({subjectId});
    });
}

Meteor.methods({

    'messages.insert'(text, subjectId) {
        check(text, String);
        check(subjectId, String);

        // Make sure the user is logged in before inserting a message
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        const now = new Date();
        Messages.insert({
            text,
            subjectId,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'messages.remove'(messageId) {
        check(messageId, String);

        Messages.remove(messageId);
    },

    'messages.setChecked'(messageId, setChecked) {
        check(messageId, String);
        check(setChecked, Boolean);

        Messages.update(messageId, { $set: { checked: setChecked } });
    }
});
