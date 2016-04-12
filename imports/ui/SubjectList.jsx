import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';
import { Labels } from '../api/labels.js';

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
                <Subject key={subject._id} subject={subject} groupLabels={this.props.groupLabels}/>
            ));
        } else {
            if(Meteor.userId()) {
                return (
                    <h2 className="ui center aligned icon disabled header" style={{marginTop:'20px'}}>
                        <i className="circular comments outline icon"></i>
                        No Subjects Found.
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
                        <div className="ui secondary menu">
                            <a href={this.props.groupFilterId?`/home/group/${this.props.groupFilterId}`:''} className={this.props.labelFilterId?"header item":"active header item"} style={{padding:'0px'}}>
                                {this.renderHeader()}
                                <span style={{color:'lightgray', position:'relative', top:'-2px', fontSize:'14px'}}>{this.props.subjects.length} subjects</span>
                            </a>
                            <div className="right menu">
                                <div className="ui dropdown item">
                                    {this.props.labelFilterId ?
                                        <span>
                                            <i className="tag icon" style={{color: this.props.currentLabel.color}}></i> {this.props.currentLabel.text}
                                        </span> : <span>Filter by Label</span>} <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <a href={`/home/group/${this.props.currentGroup._id}`} key={0} className="item">
                                            <i className="remove icon"></i> Clear filter
                                        </a>
                                        <div className="divider"></div>
                                        <div className="header">Labels</div>
                                        {this.renderLabelItems()}
                                    </div>
                                </div>
                                {this.renderSettingsDropdown()}
                            </div>
                        </div>
                        {/*}<header>
                            {this.renderSettingsDropdown()}
                        </header>
                        <div className="ui secondary menu">
                            <a className="header item">
                                {this.renderHeader()}
                                <span style={{color:'lightgray', position:'relative', top:'-2px', fontSize:'14px'}}>{this.props.subjects.length} subjects</span>
                            </a>

                            <div className="right menu">
                                {this.renderSettingsDropdown()}
                            </div>
                        </div>*/}
                    </div>
                    <div className="item-list subject-list ui segment" style={{height: Meteor.userId() ? 'calc(100% - 355px)':'calc(100% - 183px)'}}>
                        <ul>
                            {this.renderSubjects()}
                        </ul>
                    </div>
                    {this.renderMessageBox()}
                </div>
            );
        }
    }

    renderLabelItems() {
        return this.props.groupLabels.map((label) => {
            return (
                <a href={`/home/group/${this.props.currentGroup._id}/label/${label._id}`} data-value={label._id} key={label._id} className="item">
                    <i className="tag icon" style={{color: label.color}}></i> {label.text}
                </a>
            );
        });
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
                <div className="ui inline icon dropdown" style={{position:'relative', top:'5px', right:'2px'}}>
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
    const labelFilterId = FlowRouter.getParam('labelFilterId');
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
    let currentLabelReady = false;
    if(labelFilterId != null) {
        currentLabelReady = Meteor.subscribe('currentLabel', labelFilterId);
    } else {
        currentLabelReady = true;
    }
    var groupsHandle = Meteor.subscribe('groups');
    var subjectsHandle = Meteor.subscribe('subjects', groupFilterId, labelFilterId);
    var labelsHandle = Meteor.subscribe('labels', groupFilterId);
    var data = {
        loading: !(groupsHandle.ready() && subjectsHandle.ready() && currentGroupReady && currentLabelReady && labelsHandle.ready()),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentGroup: Groups.findOne(groupFilterId),
        groupLabels: Labels.find().fetch(),
        currentLabel: Labels.findOne(labelFilterId),
        currentUser: Meteor.user(),
        homeSection,
        groupFilterId,
        labelFilterId
    };
    let selector = {};
    switch(homeSection) {
        case 'open': selector.status = 'open'; break;
        case 'closed': selector.status = 'closed'; break;
        case 'inbox':
            console.log("USER: " + JSON.stringify(Meteor.user()));
            selector.$or = [{assignee: Meteor.user().username}, {groupId:Meteor.user().groupId}];
            break;
    }
    if(groupFilterId != null) {
        selector.groupId = groupFilterId;
        selector.status = 'open';
    }

    data.subjects = Subjects.find(selector, { sort: { updatedAt: -1 } }).fetch();
    console.log("SubjectList loading " + data.loading + ", subjects: " + JSON.stringify(data.subjects));

    return data;
}, SubjectList);
