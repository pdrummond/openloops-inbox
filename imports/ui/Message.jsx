import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import {parseMarkdown} from 'meteor/themeteorchef:commonmark';
import {moment} from 'meteor/momentjs:moment';

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
            <div className="event">
                <a className="label">
                    <img src={this.getUserProfileImage()}/>
                </a>
                <div className="content">
                    <div className="summary">
                        {this.props.message.username}
                        <span className="date">{moment(this.props.message.createdAt).fromNow()}</span>
                    </div>
                    <div className="extra text markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( this.props.message.text ) }>
                    </div>
                    </div>
                </div>
            );
        }

        getHtmlContent(content) {
            if ( content ) {
                return { __html: parseMarkdown(content) };
            }
        }

        getUserProfileImage() {
            var user = Meteor.users.findOne(this.props.message.owner);
            return user.profileImage;
        }
    }

    Message.propTypes = {
        // This component gets the message to display through a React prop.
        // We can use propTypes to indicate it is required
        message: PropTypes.object.isRequired,
    };
