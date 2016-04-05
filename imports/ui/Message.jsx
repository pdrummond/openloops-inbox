import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import {parseMarkdown} from 'meteor/themeteorchef:commonmark';

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
                    <img src="http://semantic-ui.com/images/avatar/small/joe.jpg"/>
                </a>
                <div className="content">
                    <div className="summary">
                        {this.props.message.username}
                        <span className="date">3 days ago</span>
                    </div>
                    <div className="extra text markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( this.props.message.text ) }>
                    </div>
                    <div className="meta">
                        <a className="delete" onClick={this.deleteThisMessage.bind(this)}>Delete</a>
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

    }

    Message.propTypes = {
        // This component gets the message to display through a React prop.
        // We can use propTypes to indicate it is required
        message: PropTypes.object.isRequired,
    };
