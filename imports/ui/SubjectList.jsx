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
        if(this.props.subjects.length > 0) {
            return this.props.subjects.map((subject) => (
                <Subject key={subject._id} subject={subject} />
            ));
        } else {
            if(Meteor.userId()) {
                return (
                    <h2 className="ui center aligned icon disabled header" style={{marginTop:'20px'}}>
                        <i className="circular comments outline icon"></i>
                        You have no {this.props.homeSection} subjects.
                    </h2>
                );
            } else {
                return (
                    <h2 className="ui center aligned icon disabled header" style={{marginTop:'20px'}}>
                        <i className="circular comments outline icon"></i>
                        All your {this.props.homeSection} subjects will appear here when you sign in.
                    </h2>
                );
            }
        }
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
                    {this.renderSignUpMessage()}
                    <SubjectsSidebar homeSection={this.props.homeSection} groupFilterId={this.props.groupFilterId} groups={this.props.groups}/>
                    <div>
                        <header>
                            {this.renderHeader()}
                            <span style={{color:'lightgray', fontSize:'14px'}}>{this.props.subjects.length} subjects</span>
                            {this.renderSettingsDropdown()}
                        </header>
                        {/*<div className="ui secondary menu">
                            <a className="header item">
                                {this.renderHeader()}
                                <span style={{color:'lightgray', position:'relative', top:'-2px', fontSize:'14px'}}>{this.props.subjects.length} subjects</span>
                            </a>

                            <div className="right menu">
                                {this.renderSettingsDropdown()}
                            </div>
                        </div>*/}
                        {/*this.renderGroupTabs()*/}
                    </div>
                    <div className="item-list subject-list ui segment" style={{height: Meteor.userId() ? 'calc(100% - 340px)':'calc(100% - 183px)'}}>
                        <ul>
                            {this.renderSubjects()}
                        </ul>
                    </div>
                    {this.renderMessageBox()}
                </div>
            );
        }
    }

    renderGroupTabs() {
        if(this.props.currentGroup && this.props.currentGroup.type == 'group') {
            return (
                <div className="ui secondary pointing menu">
                    <a className="active item">
                        All Open Subjects
                    </a>
                    <a className="item">
                        Milestone One
                    </a>
                    <a className="item">
                        All Closed Tasks
                    </a>
                    <div className="right menu">
                        <div className="ui dropdown item">
                            <i className="vertical ellipsis icon"></i>
                            <div className="menu">
                                <div className="ui item">New Tab</div>
                                <div className="ui item">Delete Tab</div>
                                <div className="ui divider"></div>
                                <div className="ui item">Edit Tabs</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderSignUpMessage() {
        if(!Meteor.userId()) {
            return (
                <div className="ui icon info message">
                    <i className="sign in icon"></i>
                    <div className="content">
                        <div className="header">
                            Welcome to OpenLoops
                        </div>
                        <p>Want to create or comment on subjects, follow groups and much, much more?</p>
                        <div className="ui buttons">
                            <a href="/join" className="ui positive button">Sign-up for FREE!</a>
                            <div className="or"></div>
                            <a href="/login" className="ui button">Login if you already have an account</a>
                        </div>

                    </div>
                </div>
            );
        }
    }

    renderMessageBox() {
        if(Meteor.userId()) {
            return <MessageBox groupFilterId={this.props.groupFilterId} groups={this.props.groups}/>;
        }
    }

    renderSettingsDropdown() {
        if(this.props.currentGroup && this.props.currentGroup.type == 'group') {
            return (
                <div className="ui inline icon dropdown" style={{marginLeft:'20px'}}>
                    <i className="circular wrench icon"></i>
                    <div className="menu">
                        <div className="item" onClick={() => { FlowRouter.go(`/home/group/${this.props.currentGroup._id}/labels`)}}>Labels</div>
                        <div className="ui divider"></div>
                        <div className="item">Edit Group</div>
                        <div className="item">Delete Group</div>
                    </div>
                </div>
            );
        }
    }

    renderHeader() {
        switch(this.props.homeSection) {
            case 'inbox': return (<h1><i className="inbox icon"></i> Inbox</h1>);
            case 'open': return (<h1><i className="comments outline icon"></i> Open</h1>);
            case 'closed': return (<h1><i className="check circle outline icon"></i> Closed </h1>);
            case 'drafts': return (<h1><i className="edit icon"></i> Drafts</h1>);
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
}

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired
};

export default createContainer(() => {
    const homeSection = FlowRouter.getParam('homeSection');
    const groupFilterId = FlowRouter.getParam('groupFilterId');
    let currentGroupReady = false;
    if(groupFilterId != null) {
        /*
        If the url is for a specific group then we want to subscribe
        to it, even if we aren't following it.
        */
        currentGroupReady = Meteor.subscribe('currentGroup', groupFilterId);
    } else {
        currentGroupReady = true;
    }
    var groupsHandle = Meteor.subscribe('groups');
    var subjectsHandle = Meteor.subscribe('subjects', groupFilterId);

    var data = {
        loading: !(groupsHandle.ready() && subjectsHandle.ready() && currentGroupReady),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentGroup: Groups.findOne(groupFilterId),
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
        selector.status = 'open';
    }
    data.subjects = Subjects.find(selector, { sort: { updatedAt: -1 } }).fetch();
    console.log("SubjectList loading " + data.loading + ", subjects: " + JSON.stringify(data.subjects));

    return data;
}, SubjectList);
