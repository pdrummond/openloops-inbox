import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Groups} from '../api/groups.js';

export default class UserGroupGridCell extends Component {

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
                    <img className="ui avatar image" src={this.getUserProfileImage()}>
                    </img>
                    <strong>{this.props.group.domain}</strong>
                </div>
                {/*}<div className="content">
                    <div className="description">
                        My name is Paul, founder of OpenLoops and all round bad ass!
                    </div>
                </div>*/}
                {/*<div className="content">
                    <span className="right floated">
                        <i className="block layout icon"></i>
                        120 groups
                    </span>
                    <i className="comment icon"></i>
                    70K messages
                </div>*/}
                <div className="extra content">
                    <div className="ui two buttons">
                        {this.renderFollowButton()}
                    </div>
                </div>
            </div>
        );
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

    handleFollowButtonClicked() {
        var member = _.findWhere(this.props.groupMembers, {userId: Meteor.userId(), groupId: this.props.group._id});
        if(member == null) {
            Meteor.call('group-members.insert', Meteor.user().username, this.props.group._id);
        } else {
            Meteor.call('group-members.remove', member._id);
        }
    }

    getUserProfileImage() {
        var user = Meteor.users.findOne({username:this.props.group.domain});
        return user.profileImage;
    }

}

UserGroupGridCell.propTypes = {
    // This component gets the group to display through a React prop.
    // We can use propTypes to indicate it is required
    group: PropTypes.object.isRequired,
};
