import { Accounts } from 'meteor/accounts-base';

import { Groups } from './groups.js';
import { GroupMembers } from './group-members.js';

Accounts.onCreateUser(function(options, user) {
    console.log("onCreateUser: " + JSON.stringify(user, null, 2));
    var email;
    if(user.emails) {
        email = user.emails[0].address;
    }

    const username = user.username;

    console.log("Creating a default group for user..." );
    const groupId = createUserGroup(user);
    user.groupId = groupId;
    console.log("User's default group created: " + user.groupId);

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
        username: user.username,
        groupId: userGroupId
    });
    console.log("group member created: " + groupMemberId);
    return userGroupId;
}
