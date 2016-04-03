import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Subjects = new Mongo.Collection('subjects');

if (Meteor.isServer) {
    Meteor.publish('subjects', function() {
        return Subjects.find();
    });

    Meteor.publish('currentSubject', function(subjectId) {
        return Subjects.find({_id: subjectId});
    });
}

Meteor.methods({

    'subjects.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a subject
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Subjects.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'subjects.remove'(subjectId) {
        check(subjectId, String);

        Subjects.remove(subjectId);
    },

    'subjects.setChecked'(subjectId, setChecked) {
        check(subjectId, String);
        check(setChecked, Boolean);

        Subjects.update(subjectId, { $set: { checked: setChecked } });
    }
});
