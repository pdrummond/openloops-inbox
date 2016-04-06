import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import {GroupMembers} from './group-members.js';

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

    'groups.insert'(domain, name, type) {
        check(domain, String);
        check(name, String);
        check(type, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        var now = new Date();
        return Groups.insert({
            domain,
            name,
            type,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'groups.update'(groupId, domain, name) {
        check(groupId, String);
        check(domain, String);
        check(name, String);

        Groups.update(groupId, {$set: {domain, name, updatedAt: new Date()}});
    },

    'groups.remove'(groupId) {
        check(groupId, String);
        GroupMembers.remove({groupId});
        Groups.remove(groupId);
    }
});
