import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import SubjectList from '../../ui/SubjectList.jsx';
import MessageList from '../../ui/MessageList.jsx';

FlowRouter.route('/', {
    name: 'subjectList',
    action() {
        mount(SubjectList, {
            main: () => <SubjectList/>
        });
    },
});

FlowRouter.route('/subject/:subjectId', {
    name: 'messageList',
    action() {
        mount(MessageList, {
            main: () => <messageList/>
        });
    },
});
