import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '../api/groups.js';
import { GroupMembers } from '../api/group-members.js';
import { Subjects } from '../api/subjects.js';

import GroupMember from './GroupMember.jsx';

class GroupMemberList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    renderGroupMembers() {
        return this.props.groupMembers.map((groupMember) => (
            <GroupMember key={groupMember._id} groupMember={groupMember} />
        ));
    }

    render() {
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container group-member-list-wrapper">
                <header>
                    <label className="hide-completed">
                        <input
                        type="checkbox"
                        readOnly
                        checked={this.state.hideCompleted}
                        onClick={this.toggleHideCompleted.bind(this)}
                        />
                    Hide Closed Groups
                </label>

                    { this.props.currentUser ?
                    <form className="new-group-member" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                        type="text"
                        ref="usernameInput"
                        placeholder="Member Username"/>
                    <button type="submit">Add Member</button>
                    </form> : '' }
                </header>
                <div className="ui segment" style={{margin:'50px', overflow: 'auto', height: 'calc(100% - 200px)'}}>
                <ul className="item-list group-member-list">
                    {this.renderGroupMembers()}
                </ul>
                </div>
                </div>
            );
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const username = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
        if(username.length > 0) {
            Meteor.call('group-members.insert', username, this.props.currentGroup._id);

            ReactDOM.findDOMNode(this.refs.usernameInput).value = '';
        }
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
}

GroupMemberList.propTypes = {
    groupMembers: PropTypes.array.isRequired
};

export default createContainer(() => {
    var groupId = FlowRouter.getParam('groupId');
    var groupMembersHandle = Meteor.subscribe('group-members', groupId);
    var currentGroupHandle = Meteor.subscribe('currentGroup', groupId);
    return {
        loading: !(groupMembersHandle.ready() && currentGroupHandle.ready()),
        groupMembers: GroupMembers.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentUser: Meteor.user(),
        currentGroup: Groups.findOne(groupId)
    };
}, GroupMemberList);
