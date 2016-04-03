import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Messages } from '../api/messages.js';

import Message from './Message.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class MessageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    renderMessages() {
        let filteredMessages = this.props.messages;
        if (this.state.hideCompleted) {
            filteredMessages = filteredMessages.filter(message => !message.checked);
        }
        return filteredMessages.map((message) => (
            <Message key={message._id} message={message} />
        ));
    }

    render() {
        return (
            <div className="container">
            <header>
                <h1>Subject One ({this.props.incompleteCount})</h1>
                <label className="hide-completed">
                    <input
                    type="checkbox"
                    readOnly
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                    />
                    Hide Completed Tasks
            </label>
                <AccountsUIWrapper />

                { this.props.currentUser ?
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new messages"/>
                </form> : '' }
            </header>
            <ul>
            {this.renderMessages()}
            </ul>
            </div>
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('messages.insert', text, this.props.subjectId);

        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    var subjectId = FlowRouter.getParam('subjectId');
    Meteor.subscribe('messages', subjectId);
    return {
        messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Messages.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
        subjectId
    };
}, MessageList);
