import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Messages } from './messages';
import { GroupMembers } from './group-members';

export const Subjects = new Mongo.Collection('Subjects');

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

    'subjects.insert'(text, groupId, subjectType) {
        check(text, String);
        check(groupId, String);
        check(subjectType, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        const now = new Date();
        return Subjects.insert({
            text,
            groupId,
            type: subjectType || 'discussion',
            status: 'open',
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

    'subjects.updateStatus'(subjectId, status) {
        check(subjectId, String);
        check(status, String);

        Subjects.update(subjectId, { $set: { status } });
    },

    'subjects.updateType'(subjectId, type) {
        check(subjectId, String);
        check(type, String);

        Subjects.update(subjectId, { $set: { type } });
    }
});

Subjects.helpers = {
    getSubjectTypeIconClassName(type) {
        var typeClassName = 'discussion';
        switch(type) {
            case 'discussion': typeClassName = 'comments'; break;
            case 'task': typeClassName = 'warning circle'; break;
            case 'question': typeClassName = 'help circle'; break;
            case 'idea': typeClassName = 'lightning'; break;
            case 'issue': typeClassName = 'bug'; break;
            case 'announcement': typeClassName = 'announcement'; break;
            case 'journal': typeClassName = 'book'; break;
            case 'story': typeClassName = 'newspaper'; break;
        }
        return "icon " + typeClassName;
    }
}
