import { FlowRouter } from 'meteor/kadira:flow-router';
import React, { Component, PropTypes } from 'react';
import { mount } from 'react-mounter';

import MainLayout from '../../ui/MainLayout.jsx';
import GroupLayout from '../../ui/GroupLayout.jsx';
import GroupList from '../../ui/GroupList.jsx';
import GroupMemberList from '../../ui/GroupMemberList.jsx';
import SubjectList from '../../ui/SubjectList.jsx';
import MessageList from '../../ui/MessageList.jsx';

FlowRouter.route('/', {
    name: 'subjectList',
    action() {
        mount(MainLayout, {
            main: () => <SubjectList/>
        });
    },
});

FlowRouter.route('/subject/:subjectId', {
    name: 'messageList',
    action() {
        mount(MainLayout, {
            main: () => <MessageList/>
        });
    },
});

FlowRouter.route('/groups', {
    name: 'groupList',
    action() {
        mount(GroupLayout, {
            main: () => <GroupList/>
        });
    },
});

FlowRouter.route('/group/:groupId', {
    name: 'groupList',
    action() {
        mount(GroupLayout, {
            main: () => <GroupMemberList/>
        });
    },
});
