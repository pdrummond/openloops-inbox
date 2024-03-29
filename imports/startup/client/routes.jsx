import { FlowRouter } from 'meteor/kadira:flow-router';
import React, { Component, PropTypes } from 'react';
import { mount } from 'react-mounter';

import MainLayout from '../../ui/MainLayout.jsx';
import LabelList from '../../ui/LabelList.jsx';
import GroupGrid from '../../ui/GroupGrid.jsx';
import GroupMemberList from '../../ui/GroupMemberList.jsx';
import SubjectList from '../../ui/SubjectList.jsx';
import MessageList from '../../ui/MessageList.jsx';
import JoinPage from '../../ui/JoinPage.jsx';
import LoginPage from '../../ui/LoginPage.jsx';

FlowRouter.route('/join', {
    name: 'join',
    action() {
        mount(JoinPage, {
            main: () => <JoinPage/>
        });
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action() {
        mount(LoginPage, {
            main: () => <LoginPage/>
        });
    }
});

FlowRouter.route('/home/:homeSection', {
    name: 'subjectList',
    action() {
        mount(MainLayout, {
            main: () => <SubjectList/>
        });
    },
});

FlowRouter.route('/home/:homeSection/:groupFilterId', {
    name: 'subjectList',
    action() {
        mount(MainLayout, {
            main: () => <SubjectList/>
        });
    },
});

FlowRouter.route('/home/:homeSection/:groupFilterId/label/:labelFilterId', {
    name: 'subjectList',
    action() {
        mount(MainLayout, {
            main: () => <SubjectList/>
        });
    },
});

FlowRouter.route('/home/:homeSection/:groupFilterId/labels', {
    name: 'labelList',
    action() {
        mount(MainLayout, {
            main: () => <LabelList/>
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

FlowRouter.route('/explore', {
    name: 'explore',
    action() {
        mount(MainLayout, {
            main: () => <GroupGrid/>
        });
    },
});


FlowRouter.route('/groups', {
    name: 'groupList',
    action() {
        mount(MainLayout, {
            main: () => <GroupList/>
        });
    },
});

FlowRouter.route('/group/:groupId', {
    name: 'groupList',
    action() {
        mount(MainLayout, {
            main: () => <GroupMemberList/>
        });
    },
});
