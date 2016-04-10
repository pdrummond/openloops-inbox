import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Groups } from './groups.js';
import { Subjects } from './subjects.js';

export const Tabs = new Mongo.Collection('Tabs');

if (Meteor.isServer) {
    Meteor.publish('tabs', function(groupId) {
        return Tabs.find({groupId});
    });

    Meteor.publish('currentTab', function(tabId) {
        return Tabs.find({_id: tabId});
    });

    Meteor.publish('subjectGroupTabs', function(subjectId) {
        var subject = Subjects.findOne(subjectId);
        var group = Groups.findOne(subject.groupId);
        return Tabs.find({groupId: group._id});
    });
}

Meteor.methods({

    'tabs.insert'(text, labelQuery, typeQuery, statusQuery, groupId) {
        check(text, String);
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        const now = new Date();
        var tabId = Tabs.insert({
            text,
            labelQuery,
            typeQuery,
            statusQuery,
            groupId,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        return tabId;
    },

    'tabs.remove'(tabId) {
        check(tabId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var tab = Tabs.findOne(tabId);
        if(tab.owner !== this.userId) {
            throw new Meteor.Error('not-authorized', 'Only the owner of the tab can delete it');
        }

        Tabs.remove(tabId);
    }
});
