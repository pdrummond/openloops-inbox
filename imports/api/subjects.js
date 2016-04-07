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

            3 - If the subject is from me, then it should always be displayed IF I am following the USER group it is sent to.

        */

        let groupIds = [];
        var userGroupIds = [];
        GroupMembers.find({userId: this.userId}).forEach(function (member) {
            var group = Groups.findOne(member.groupId);
            if(group.type == 'group') {
                //(1)
                groupIds.push(member.groupId);
            } else {
                //(3)
                userGroupIds.push(member.groupId);
            }
        });
        var user = Meteor.users.findOne(this.userId);
        //(2)
        groupIds.push(user.groupId);

        //console.log("subject groupIds: " + JSON.stringify(groupIds));
        //console.log("subject userGroupIds: " + JSON.stringify(userGroupIds));

        return Subjects.find({ $or: [
            {owner: this.userId, groupId: {$in: userGroupIds}}, //(3) - if subject is from me and it's sent to a user I am following, then allow it.
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

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var subject = Subjects.findOne(subjectId);
        if(subject.owner !== this.userId) {
            throw new Meteor.Error('not-authorized', 'Only the owner of the subject can delete it');
        }

        Messages.remove({subjectId});
        Subjects.remove(subjectId);
    },

    'subjects.updateStatus'(subjectId, status) {
        check(subjectId, String);
        check(status, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        Subjects.update(subjectId, { $set: { status } });
    },

    'subjects.updateType'(subjectId, type) {
        check(subjectId, String);
        check(type, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

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
