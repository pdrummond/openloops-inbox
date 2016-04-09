import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Groups } from './groups.js'

export const Labels = new Mongo.Collection('Labels');

if (Meteor.isServer) {
    Meteor.publish('labels', function labelsPublication(groupId) {
        return Labels.find({groupId});
    });
}

Meteor.methods({

    'labels.insert'(text, color, description, groupId) {
        check(text, String);
        check(color, String);
        check(description, String);
        check(groupId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        const now = new Date();
        var labelId = Labels.insert({
            text,
            color,
            description,
            groupId,
            createdAt: now,
            updatedAt: now,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        return labelId;
    },

    'labels.remove'(labelId) {
        check(labelId, String);

        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authenticated');
        }

        var label = Labels.findOne(labelId);
        if(label.owner !== this.userId) {
            throw new Meteor.Error('not-authorized', 'Only the owner of the label can delete it');
        }

        Labels.remove(labelId);
    }
});
