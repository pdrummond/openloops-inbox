import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import {GroupMembers} from './group-members.js';
import {Subjects} from './subjects.js';
import {Messages} from './messages.js';

export const Groups = new Mongo.Collection('Groups');

if (Meteor.isServer) {

    Meteor.publish('allGroups', function() {
        return Groups.find();
    });

    Meteor.publish('groups', function() {
        //Publish all the groups that the current user is a member of
        var groupIds = GroupMembers.find({userId: this.userId}).map(function (member) {
            return member.groupId;
        });
        return Groups.find({_id: {$in: groupIds}});
    });

    Meteor.publish('currentGroup', function(groupId) {
        //Publish the group if the user is a member.
        //if(GroupMembers.findOne({userId: this.userId, groupId})) {
            return Groups.find({_id: groupId});
        //}
    });
}

Meteor.methods({

    'groups.insert'(domain, name, description, logoImageUrl, coverImageUrl, type) {
        check(domain, String);
        check(name, String);
        check(description, String);
        check(logoImageUrl, String);
        check(coverImageUrl, String);
        check(type, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var now = new Date();
        return Groups.insert({
            domain,
            name,
            description,
            logoImageUrl,
            coverImageUrl,
            type,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'groups.update'(groupId, domain, name, description, logoImageUrl, coverImageUrl) {
        check(groupId, String);
        check(domain, String);
        check(name, String);
        check(description, String);
        check(logoImageUrl, String);
        check(coverImageUrl, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var group = Groups.findOne(groupId);
        if(group.owner !== this.userId) {
            throw new Meteor.Error('not-authorized', 'Only the owner of the group can delete it');
        }

        Groups.update(groupId, {$set: {domain, name, description, logoImageUrl, coverImageUrl, updatedAt: new Date()}});
    },

    'groups.remove'(groupId) {
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var group = Groups.findOne(groupId);
        if(group.owner !== this.userId) {
            throw new Meteor.Error('not-authorized', 'Only the owner of the group can delete it');
        }

        Messages.remove({groupId});
        Subjects.remove({groupId});
        GroupMembers.remove({groupId});
        Groups.remove(groupId);
    }
});
