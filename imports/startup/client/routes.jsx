import { FlowRouter } from 'meteor/kadira:flow-router';
import React, { Component, PropTypes } from 'react';
import { mount } from 'react-mounter';

import MainLayout from '../../ui/MainLayout.jsx';
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
        mount(MessageList, {
            main: () => <MessageList/>
        });
    },
});
