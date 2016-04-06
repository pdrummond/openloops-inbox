import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Groups} from '../api/groups.js';

// Group component - represents a single todo item
export default class Group extends Component {

    toggleChecked() {
        Meteor.call('groups.setChecked', this.props.group._id, !this.props.group.checked);
    }

    deleteThisGroup() {
         Meteor.call('groups.remove', this.props.group._id);
    }

    render() {
    const groupClassName = this.props.group.checked ? 'checked' : '';

    return (
      <li className={groupClassName}>
        <button className="delete" onClick={this.deleteThisGroup.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.group.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        {this.renderGroupLink()}
     </li>
    );
  }

  renderGroupLink() {
      if(this.props.group.type == 'group') {
          return (
              <a href={`/group/${this.props.group._id}`}><span>
                  <i className="block layout icon" style={{marginLeft:'10px', color:'gray'}}></i>
                  <span className="text">
                    <strong>{this.props.group.domain} / {this.props.group.name} </strong>
                </span>
              </span></a>
          );
      } else {
          return (
               <a href={`/group/${this.props.group._id}`}><span>
                  <i className="user icon" style={{marginLeft:'10px', color:'gray'}}></i>
                  <span className="text">
                    <strong>{this.props.group.domain}</strong>
                </span>
            </span></a>
          );
      }
  }
}

Group.propTypes = {
    // This component gets the group to display through a React prop.
    // We can use propTypes to indicate it is required
    group: PropTypes.object.isRequired,
};
