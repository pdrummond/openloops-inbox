import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Messages } from '../api/messages.js';
import { Subjects } from '../api/subjects.js';

import Message from './Message.jsx';


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
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container message-list">
                <header>
                    <h1>{this.props.currentSubject.text} ({this.props.incompleteCount})</h1>
                    <label className="hide-completed">
                        <input
                        type="checkbox"
                        readOnly
                        checked={this.state.hideCompleted}
                        onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                </label>

                    { this.props.currentUser ?
                    <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Type to add new messages"/>
                    </form> : '' }
                </header>
                <div className="ui segment" style={{margin:'50px', overflow: 'auto', height: 'calc(100% - 200px)'}}>
                <ul className="ui minimal comments">
                    {this.renderMessages()}
                </ul>
                </div>
                </div>
            );
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('messages.insert', text, this.props.currentSubject._id);

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
    var messagesHandle = Meteor.subscribe('messages', subjectId);
    var subjectHandle = Meteor.subscribe('currentSubject', subjectId);
    return {
        loading: !(messagesHandle.ready() && subjectHandle.ready()),
        messages: Messages.find({}, { sort: { createdAt: 1 } }).fetch(),
        incompleteCount: Messages.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
        currentSubject: Subjects.findOne(subjectId)
    };
}, MessageList);
