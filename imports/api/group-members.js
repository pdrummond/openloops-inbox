import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const GroupMembers = new Mongo.Collection('GroupMembers');

if (Meteor.isServer) {
    Meteor.publish('group-members', function(groupId) {
        return GroupMembers.find({groupId});
    });

    Meteor.publish('currentUserGroupMembers', function() {
        return GroupMembers.find({userId: this.userId});
    });
}

Meteor.methods({

    'group-members.insert'(username, groupId) {
        check(username, String);
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        console.log("finding user with username: '" + username + "''");
        var user = Meteor.users.findOne({username});
        console.log("user: " + user);
        if(user == null) {
            throw new Meteor.Error('cannot-find-user', 'There is no account with the username: ' + username);
        }
        console.log("user is: " + JSON.stringify(user, null, 2));

        var now = new Date();
        return GroupMembers.insert({
            userId: user._id,
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
