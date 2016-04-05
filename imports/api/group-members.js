import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const GroupMembers = new Mongo.Collection('GroupMembers');

if (Meteor.isServer) {
    Meteor.publish('group-members', function(groupId) {
        return GroupMembers.find({groupId});
    });
}

Meteor.methods({

    'group-members.insert'(username, groupId) {
        check(username, String);
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        var now = new Date();
        return GroupMembers.insert({
            username,
            groupId,
            createdAt: now,
            updatedAt: now
        });
    },

    'group-members.remove'(memberId) {
        check(memberId, String);

        GroupMembers.remove(memberId);
    }
});
