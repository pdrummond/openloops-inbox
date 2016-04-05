import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import {GroupMembers} from './group-members.js';

export const Groups = new Mongo.Collection('Groups');

if (Meteor.isServer) {
    Meteor.publish('groups', function messagesPublication() {
        return Groups.find({});
    });

    Meteor.publish('currentGroup', function(groupId) {
        return Groups.find({_id: groupId});
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
