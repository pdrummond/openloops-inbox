import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Messages } from './messages';
import { Groups } from './groups';
import { GroupMembers } from './group-members';

export const Subjects = new Mongo.Collection('Subjects');

if (Meteor.isServer) {
    Meteor.publish('subjects', function(groupFilterId, labelFilterId) {

        /*
            If a user is logged in, then the subject publication is more complicated - see below
            for more comments on that.  If not logged in, then it's simple - just return subjects
            belonging to public groups only.
        */

        if(this.userId) {
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
            let subjectSelector = { $or: [
                {owner: this.userId, groupId: {$in: userGroupIds}}, //(3) - if subject is from me and it's sent to a user I am following, then allow it.
                {groupId: {$in: groupIds}}
            ]};
            if(labelFilterId != null) {
                subjectSelector.labels = labelFilterId;
            }

            return Subjects.find(subjectSelector, {sort: {updatedAt: -1}});
        } else {
            return Subjects.find({groupId: groupFilterId});
        }
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
            labels: []
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
    },

    'subjects.toggleLabel'(subjectId, labelId) {
        check(subjectId, String);
        check(labelId, String);

        console.log("subjects.toggleLabel subjectId=" + subjectId + ", labelId:" + labelId);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        let subject = Subjects.findOne(subjectId);
        let hasLabel = false;
        console.log("xxx subject labels: " + JSON.stringify(subject.labels));
        if(subject.labels) {
            hasLabel = _.contains(subject.labels, labelId);
        }
        console.log("hasLabel:" + hasLabel);

        var now = new Date();
        if(hasLabel) {
            console.log("removing label " + labelId + " from subject " + subjectId);
            Subjects.update(subjectId, {
                $pull: {labels: labelId},
                $set: {updatedAt: now}
            });
        } else {
            console.log("adding label " + labelId + " to subject " + subjectId);
            Subjects.update(subjectId, {
                $addToSet: {labels: labelId},
                $set: {updatedAt: now}
            });
        }
        subject = Subjects.findOne(subjectId);
        console.log("subject labels: " + JSON.stringify(subject.labels));
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
    },

    getSubjectTypeIconColor(type) {
        let color = 'black';
        switch(type) {
            case 'discussion': color = '#026AA7'; break;
            case 'story': color = '#00BCD4'; break;
            case 'journal': color = '#375BC8'; break;

            case 'task': color = '#8BC34A'; break;
            case 'feature': color = '#9C27B0'; break;
            case 'problem': color = '#EB0000'; break;
            case 'bug': color = '#FF5722'; break;

            case 'question': color = '#A89B2F'; break;
            case 'idea': color = '#795548'; break;

            case 'announcement': color = '#AC2AAC'; break;

            case 'channel': color = 'black'; break;
        }
        return color;
    }
}
