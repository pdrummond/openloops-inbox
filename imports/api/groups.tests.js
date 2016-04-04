/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Groups } from './groups.js';
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
    describe('Groups', () => {
        describe('methods', () => {
            const userId = Random.id();
            let groupId;

            beforeEach(() => {
                Groups.remove({});
                const now = new Date();
                groupId = Groups.insert({
                    domain: 'pdrummond',
                    name: 'test',
                    createdAt: now,
                    updatedAt: now,
                    owner: userId,
                    username: 'pdrummond'
                });
            });

            it('can update own group', () => {
                const method = Meteor.server.method_handlers['groups.update'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                method.apply(invocation, [groupId, 'pdrummond-changed', 'test-changed']);

                var group = Groups.findOne(groupId);
                console.log("GROUP: " + JSON.stringify(group, null, 4));
                expect(group.domain).to.equal("pdrummond-changed");
                expect(group.name).to.equal("test-changed");
                expect(group.updatedAt.getTime()).to.not.equal(group.createdAt.getTime());
            });

            it('can delete owned group', () => {
                // Find the internal implementation of the group method so we can
                // test it in isolation
                const deleteGroup = Meteor.server.method_handlers['groups.remove'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                deleteGroup.apply(invocation, [groupId]);

                // Verify that the method does what we expected
                assert.equal(Groups.find().count(), 0);
            });
        });
    });
}
