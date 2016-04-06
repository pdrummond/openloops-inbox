import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import Subject from './Subject.jsx';
import MessageBox from './MessageBox.jsx';
import SubjectsSidebar from './SubjectsSidebar.jsx';

class SubjectList extends Component {

    constructor(props) {
        super(props);


    }

    renderSubjects() {
        return this.props.subjects.map((subject) => (
            <Subject key={subject._id} subject={subject} />
        ));
    }

    componentDidUpdate() {
        $('.ui.dropdown').dropdown('refresh');
    }

    render() {
        if(this.props.loading) {
            return (
                <p>Loading...</p>
            );
        } else {
            return (
                <div className="container subject-list-wrapper">
                    <SubjectsSidebar homeSection={this.props.homeSection} groupFilterId={this.props.groupFilterId} groups={this.props.groups}/>
                    <div>
                        <header>
                            {this.renderHeader()}
                        </header>
                    </div>
                    <div className="item-list subject-list ui segment">
                        <ul>
                            {this.renderSubjects()}
                        </ul>
                    </div>
                    {this.renderMessageBox()}
                </div>
            );
        }
    }

    renderHeader() {
        switch(this.props.homeSection) {
            case 'inbox-old': return (<h1><i className="inbox icon"></i> Inbox</h1>);
            case 'inbox': return (<h1><i className="comments outline icon"></i> Open Subjects</h1>);
            case 'closed': return (<h1><i className="check circle outline icon"></i> Closed Subjects</h1>);
            case 'drafts': return (<h1><i className="edit icon"></i> Draft Subjects</h1>);
            case 'group': {
                var group = Groups.findOne(this.props.groupFilterId);
                if(group.type == 'group') {
                    return (<h1><i className="ui block layout icon"></i> {group.domain} / {group.name} </h1>);
                } else {
                    return (<h1><i className="ui user icon"></i> {group.domain}</h1>);
                }
            }
        }
    }

    renderMessageBox() {
        if(this.props.currentUser) {
            return <MessageBox groupFilterId={this.props.groupFilterId} groups={this.props.groups}/>;
        }
    }
}

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    const homeSection = FlowRouter.getParam('homeSection');
    const groupFilterId = FlowRouter.getParam('groupFilterId');
    var groupsHandle = Meteor.subscribe('groups');
    var subjectsHandleReady = false;
    if(Meteor.user()) {
        var subjectsHandle = Meteor.subscribe('subjects', Meteor.user().username);
        subjectsHandleReady = subjectsHandle.ready();
    } else {
        subjectsHandleReady = true;
    }
    var data = {
        loading: !(groupsHandle.ready() && subjectsHandleReady),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        incompleteCount: Subjects.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
        homeSection,
        groupFilterId
    };
    let selector = {};
    switch(homeSection) {
        case 'inbox': selector.status = 'open'; break;
        case 'closed': selector.status = 'closed'; break;
    }
    if(groupFilterId != null) {
        selector.groupId = groupFilterId;
    }
    data.subjects = Subjects.find(selector, { sort: { updatedAt: -1 } }).fetch();

    return data;
}, SubjectList);
