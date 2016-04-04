import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Messages } from './messages';
import { GroupMembers } from './group-members';

export const Subjects = new Mongo.Collection('subjects');

if (Meteor.isServer) {
    Meteor.publish('subjects', function(username) {
        const groupIds = GroupMembers.find({username}).map(function (member) {
            return member.groupId;
        });
        return Subjects.find({$or: [{username}, {groupId: {$in: groupIds}}]});
    });

    Meteor.publish('currentSubject', function(subjectId) {
        return Subjects.find({_id: subjectId});
    });
}

Meteor.methods({

    'subjects.insert'(text, groupId) {
        check(text, String);
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        const now = new Date();
        return Subjects.insert({
            text,
            groupId,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'subjects.remove'(subjectId) {
        check(subjectId, String);
        Messages.remove({subjectId});
        Subjects.remove(subjectId);
    },

    'subjects.setChecked'(subjectId, setChecked) {
        check(subjectId, String);
        check(setChecked, Boolean);

        Subjects.update(subjectId, { $set: { checked: setChecked } });
    }
});
