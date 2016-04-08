import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';
import {GroupMembers} from '../api/group-members.js';
import FollowLoginModal from './FollowLoginModal.jsx';
import GroupGridCell from './GroupGridCell.jsx';
import UserGroupGridCell from './UserGroupGridCell.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';

class GroupGrid extends Component {

    constructor(props) {
        super(props);
    }

    renderGroupCells() {
        let filteredGroups = this.props.groups.filter(group => group.type == 'group');
        return filteredGroups.map((group) => (
            <GroupGridCell key={group._id} group={group} groupMembers={this.props.groupMembers} onShowFollowLoginModal={this.showFollowLoginModal.bind(this)}/>
        ));
    }

    renderUserGroupCells() {
        let filteredGroups = this.props.groups.filter(group => group.type == 'user');
        return filteredGroups.map((group) => (
            <UserGroupGridCell key={group._id} group={group} groupMembers={this.props.groupMembers} />
        ));
    }

    showFollowLoginModal() {
        $('#follow-login-modal').modal('show');
    }

    render() {
        if(this.props.loading) {
            return (<p>Loading...</p>);
        } else {
            return (
                <div className="container group-list-wrapper">
                        <FollowLoginModal/>
                        {Meteor.userId() ? <div style={{marginLeft:'60px', marginTop:'10px'}}><CreateGroupModal/></div>:''}
                        <div style={{margin:'50px', height:'calc(100% - 80px)', overflow:'auto'}}>

                            <div style={{padding:'10px'}}>
                                <h2 className="ui header">
                                    <span> <i className="ui circular star icon"></i> Featured Groups </span>
                                </h2>
                                <div className="ui secondary segment">
                                    <ul className="ui cards group-grid">
                                        {this.renderGroupCells()}
                                    </ul>
                                </div>
                                <h2 className="ui header">
                                    <span> <i className="ui circular user icon"></i> Top Users </span>
                                </h2>
                                <div className="ui secondary segment">
                                    <ul className="ui cards group-grid">
                                        {this.renderUserGroupCells()}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        toggleHideCompleted() {
            this.setState({
                hideCompleted: !this.state.hideCompleted,
            });
        }
    }

    GroupGrid.propTypes = {
        groups: PropTypes.array.isRequired
    };

    export default createContainer(() => {
        var groupsHandle = Meteor.subscribe('allGroups');
        var userDataHandle = Meteor.subscribe('userData');
        var groupMembersHandle = Meteor.subscribe('currentUserGroupMembers');
        return {
            loading: !(groupsHandle.ready() && userDataHandle.ready() && groupMembersHandle.ready()),
            groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
            groupMembers: GroupMembers.find().fetch(),
            currentUser: Meteor.user()
        };
    }, GroupGrid);
