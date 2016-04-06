import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Messages } from './messages';
import { Groups } from './groups';
import { GroupMembers } from './group-members';

export const Subjects = new Mongo.Collection('Subjects');

if (Meteor.isServer) {
    Meteor.publish('subjects', function() {

        /*
            This publication is responsible for what subjects appear in the subject list
            based on which groups and users you follow.

            1 - For NORMAL groups we want to publish all the subjects that belong to groups you are a member of.

            2 - For USER groups we only want the subjects that are sent to your user group.

            3 - Also need to always show subjects from you know matter where they are sent.

        */

        let groupIds = [];
        var myFollowers = [];
        GroupMembers.find({userId: this.userId}).forEach(function (member) {
            var group = Groups.findOne(member.groupId);
            if(group.type == 'group') {
                //(1)
                groupIds.push(member.groupId);
            }
        });
        var user = Meteor.users.findOne(this.userId);
        //(2)
        groupIds.push(user.groupId);

        //console.log("subject groupIds: " + JSON.stringify(groupIds));

        return Subjects.find({ $or: [
            {owner: this.userId}, //(3)
            {groupId: {$in: groupIds}}
        ]}, {sort: {updatedAt: -1}});
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
            case 'story': typeClassName = 'newspaper'; break;
            case 'journal': typeClassName = 'book'; break;

            case 'task': typeClassName = 'warning circle'; break;
            case 'feature': typeClassName = 'bullseye'; break;
            case 'problem': typeClassName = 'bomb'; break;
            case 'bug': typeClassName = 'bug'; break;

            case 'question': typeClassName = 'help circle'; break;
            case 'idea': typeClassName = 'lightning'; break;

            case 'announcement': typeClassName = 'announcement'; break;

            case 'channel': typeClassName = 'square'; break;

        }
        return "icon " + typeClassName;
    }
}
