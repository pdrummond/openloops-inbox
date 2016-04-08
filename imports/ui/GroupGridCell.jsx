import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Groups} from '../api/groups.js';

import EditGroupModal from './EditGroupModal.jsx';

export default class GroupGridCell extends Component {

    toggleChecked() {
        Meteor.call('groups.setChecked', this.props.group._id, !this.props.group.checked);
    }

    deleteThisGroup() {
        Meteor.call('groups.remove', this.props.group._id);
    }

    render() {
        const groupClassName = this.props.group.checked ? 'checked' : '';

        return (
            <div className="ui card">
                <div className="content">
                    <img className="ui avatar image" src={this.props.group.logoImageUrl}>
                    </img>
                    <strong><a href={`/home/group/${this.props.group._id}`}>{this.props.group.domain} / {this.props.group.name}</a></strong>
                </div>
                <div className="image">
                    <img style={{maxHeight:'160px'}} src={this.props.group.coverImageUrl}>
                    </img>
                </div>
                <div className="content">
                    <div className="description">
                        {this.props.group.description}
                    </div>
                </div>
                {/*<div className="content">
                    <span className="right floated">
                        <i className="heart outline like icon"></i>
                        17 likes
                    </span>
                    <i className="user icon"></i>
                    3000 members
                </div>*/}
                <div className="extra content">

                    <div className="ui two buttons">
                        {this.renderFollowButton()}
                    </div>
                </div>
                {this.renderOwnerButtons()}
            </div>
        );
    }

    renderOwnerButtons() {
        if(Meteor.userId()) {
            return (
                <div className="extra content right">
                <EditGroupModal group={this.props.group}/>
                <div className="ui mini button" onClick={this.handleDeleteButtonClicked.bind(this)}><i className="remove icon"></i> Delete</div>
            </div>
            );
        }
    }

    renderFollowButton() {
        var member = _.findWhere(this.props.groupMembers, {userId: Meteor.userId(), groupId: this.props.group._id});
        if(member == null) {
            return (
                <div className="ui green button" onClick={this.handleFollowButtonClicked.bind(this)}>
                    <i className="plus icon"></i> Follow
                </div>
            );
        } else {
            return (
                <div className="ui animated vertical blue button" onClick={this.handleFollowButtonClicked.bind(this)}>
                    <div className="visible content">Following</div>
                    <div className="hidden content">
                        Unfollow
                    </div>
                </div>
            );
        }
    }

    handleDeleteButtonClicked() {
        Meteor.call('groups.remove', this.props.group._id);
    }

    handleFollowButtonClicked() {
        if(Meteor.userId()) {
            var member = _.findWhere(this.props.groupMembers, {userId: Meteor.userId(), groupId: this.props.group._id});
            if(member == null) {
                Meteor.call('group-members.insert', Meteor.user().username, this.props.group._id);
            } else {
                Meteor.call('group-members.remove', member._id);
            }
        } else {
            this.props.onShowFollowLoginModal();
        }
    }
}

GroupGridCell.propTypes = {
    // This component gets the group to display through a React prop.
    // We can use propTypes to indicate it is required
    group: PropTypes.object.isRequired,
};
