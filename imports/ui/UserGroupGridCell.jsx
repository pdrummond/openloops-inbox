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
                <div className="content">
                    <span className="right floated">
                        <i className="block layout icon"></i>
                        120 groups
                    </span>
                    <i className="comment icon"></i>
                    70K messages
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui basic blue button"><i className="plus icon"></i> Follow</div>
                    </div>

                </div>
            </div>
        );
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
