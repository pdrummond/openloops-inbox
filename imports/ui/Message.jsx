import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Messages} from '../api/messages.js';

// Message component - represents a single todo item
export default class Message extends Component {

    toggleChecked() {
        Meteor.call('messages.setChecked', this.props.message._id, !this.props.message.checked);
    }

    deleteThisMessage() {
         Meteor.call('messages.remove', this.props.message._id);
    }

    render() {
    // Give messages a different className when they are checked off,
    // so that we can style them nicely in CSS
    const messageClassName = this.props.message.checked ? 'checked' : '';

    return (
      <li className={messageClassName}>
        <button className="delete" onClick={this.deleteThisMessage.bind(this)}>
          &times;
        </button>

        {/*<input
          type="checkbox"
          readOnly
          checked={this.props.message.checked}
          onClick={this.toggleChecked.bind(this)}
        />*/}

        <span className="text">
         <strong>{this.props.message.username}</strong>: {this.props.message.text}
       </span>
      </li>
    );
  }

}

Message.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};
