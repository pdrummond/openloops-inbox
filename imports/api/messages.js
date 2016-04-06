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

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        var subject = Subjects.findOne(subjectId);
        if(!subject) {
            throw new Meteor.Error('subject-not-found', 'No subject found with id ' + subjectId);
        }

        const now = new Date();
        var messageId = Messages.insert({
            text,
            subjectId,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        if(messageId != null) {
            Subjects.update(subject._id, { $set: {updatedAt: now}});
        }

        return messageId;
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
