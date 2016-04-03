import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';

export default class SubjectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };
    }

    render() {
        return (
            <div className="message-box">
                    <div style={{display:'flex', width:'100%'}}>
                        <input ref="subjectRef" autofocus="autofocus" placeholder="Subject" style={{marginRight:'10px'}}/>
                        <input ref="toRef" placeholder="To"/>
                    </div>
                    <textarea onChange={this.onChange.bind(this)}
                              onKeyDown={this.onKeyDown.bind(this)}
                              type="text"
                              name="message"
                              placeholder="Type here to add message..."
                              value={this.state.content}
                              autofocus="autofocus"
                    />
                <button style={{float:'right'}}className="ui button" onClick={this.onCreateSubjectClicked.bind(this)}>Create</button>
            </div>
        );
    }

    onChange(event, value) {
        if (event.target.value !== "\n") {
            this.setState({content: event.target.value});
            //this.props.onUserIsTyping();
        }
    }

    onKeyDown(event) {
        if (event.keyCode === 13 && event.shiftKey == false) {
            this.doCreateSubject();
        }
    }

    onCreateSubjectClicked() {
        this.doCreateSubject();
    }

    doCreateSubject() {
        const messageText = this.state.content.trim();
        const subject = ReactDOM.findDOMNode(this.refs.subjectRef).value.trim();
        if(messageText.length > 0 && subject.length > 0) {
            Meteor.call('subjects.insert', subject, function(err, subjectId) {
                if(err) {
                    alert("Error adding subject: " + err.reason);
                } else {
                    this.doCreateMessage(messageText, subjectId);
                }
            }.bind(this));
        }
    }

    doCreateMessage(messageText, subjectId) {        
        Meteor.call('messages.insert', messageText, subjectId, function(err) {
            if(err) {
                alert("Error adding message: " + err.reason);
            } else {
                ReactDOM.findDOMNode(this.refs.subjectRef).value = '';
                ReactDOM.findDOMNode(this.refs.toRef).value = '';
                this.setState({content: ''});
            }
        }.bind(this));

    }
}
