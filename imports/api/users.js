import { Accounts } from 'meteor/accounts-base';
import {Gravatar} from 'meteor/jparker:gravatar';

import { Groups } from './groups.js';
import { GroupMembers } from './group-members.js';

if(Meteor.isServer) {
    Meteor.publish("userData", function () {
        return Meteor.users.find({}, {fields: {
            "username": 1,
            "groupId": 1,
            "profileImage": 1
        }});
    });
}

Accounts.onCreateUser(function(options, user) {
    // Generate a user ID ourselves as we will be using it for the group member.
    user._id = Random.id();

    console.log("onCreateUser: " + JSON.stringify(user, null, 2));
    var email;
    if(user.emails) {
        email = user.emails[0].address;
    }

    console.log("Creating a default group for user..." );
    const groupId = createUserGroup(user);
    user.groupId = groupId;
    console.log("User's default group created: " + user.groupId);

    //TODO: This is temporarily.  Eventually we will support custom profile images
    //where users can upload their own pics or we will take the pic from google/fb account
    //if user has connected their accounts.  For now, during MVP - gravatar will do.
    user.profileImage = Gravatar.imageUrl(email, {size: 50, default: 'wavatar'});

    if (options.profile) {
        user.profile = options.profile;
    }

    return user;
});

function createUserGroup(user) {
    var now = new Date();
    const userGroupId = Groups.insert({
        domain: user.username,
        name: user.username,
        type: 'user',
        createdAt: now,
        updatedAt: now,
        owner: user._id,
        username: user.username
    });
    const groupMemberId = GroupMembers.insert({
        userId: user._id,
        username: user.username,
        groupId: userGroupId
    });
    console.log("group member created: " + groupMemberId);
    return userGroupId;
}
