import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
    Meteor.publish('messages', function messagesPublication() {
        return Messages.find();
    });
}

Meteor.methods({

    'messages.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a message
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Messages.insert({
            text,
            createdAt: new Date(),
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
