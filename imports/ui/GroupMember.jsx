import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {GroupMembers} from '../api/group-members.js';

export default class GroupMember extends Component {

    deleteThisGroupMember() {
         Meteor.call('group-members.remove', this.props.groupMember._id);
    }

    render() {
        const groupMemberClassName = this.props.groupMember.checked ? 'checked' : '';

        return (
          <li className={groupMemberClassName}>
            <button className="delete" onClick={this.deleteThisGroupMember.bind(this)}>
              &times;
            </button>

            <i className='user icon' style={{marginLeft:'10px', color:'gray'}}></i>

            <span className="text">
                {this.props.groupMember.username}
            </span>
         </li>
        );
     }
}

GroupMember.propTypes = {
    // This component gets the groupMember to display through a React prop.
    // We can use propTypes to indicate it is required
    groupMember: PropTypes.object.isRequired,
};
