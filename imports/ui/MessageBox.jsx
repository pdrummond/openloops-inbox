import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';

export default class SubjectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            zenMode: false,
            createOnEnter: false
        };
        console.log("ctor zenMode: " + this.state.zenMode);
    }

    render() {
        console.log("render createOnEnter:" + this.state.createOnEnter);
        return (
            <div className="message-box" style={{top: (this.state.zenMode?'75px':'auto')}}>
                    <div style={{display:'flex', width:'100%'}}>
                        <input ref="subjectRef" autofocus="autofocus" placeholder="Subject" style={{marginRight:'10px'}}/>
                        <input ref="toRef" placeholder="To"/>
                    </div>
                    <textarea style={{height: (this.state.zenMode?'calc(100% - 72px)':'150px')}}
                              onChange={this.onChange.bind(this)}
                              onKeyDown={this.onKeyDown.bind(this)}
                              type="text"
                              name="message"
                              placeholder="Type here to add message..."
                              value={this.state.content}
                              autofocus="autofocus"
                    />
                <div>
                    <div className="ui toggle checkbox" style={{top:'8px'}}>
                        <input
                            type="checkbox"
                            checked={this.state.createOnEnter}
                            onClick={() => { this.setState({createOnEnter: !this.state.createOnEnter}) } }/>
                        <label>Press ENTER to create</label>
                    </div>
                    <div style={{float:'right'}}>
                        <button className="ui icon button" onClick={this.onToggleZenModeClicked.bind(this)}><i className="maximize icon"></i></button>
                        <button className="ui button" onClick={this.onCreateSubjectClicked.bind(this)}>Create</button>
                    </div>
                </div>
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
        if(this.state.createOnEnter) {
            if (event.keyCode === 13 && event.shiftKey == false) {
                this.doCreateSubject();
            }
        }
    }

    onCreateSubjectClicked() {
        this.doCreateSubject();
    }

    doCreateSubject() {
        const subject = ReactDOM.findDOMNode(this.refs.subjectRef).value.trim();
        if(subject.length > 0) {
            Meteor.call('subjects.insert', subject, function(err, subjectId) {
                if(err) {
                    alert("Error adding subject: " + err.reason);
                } else {
                    ReactDOM.findDOMNode(this.refs.subjectRef).value = '';
                    ReactDOM.findDOMNode(this.refs.toRef).value = '';
                    this.doCreateMessage(subjectId);
                }
            }.bind(this));
        }
    }

    doCreateMessage(subjectId) {
        const messageText = this.state.content.trim();
        if(messageText.length > 0) {
            Meteor.call('messages.insert', messageText, subjectId, function(err) {
                if(err) {
                    alert("Error adding message: " + err.reason);
                } else {
                    this.setState({content: ''});
                }
            }.bind(this));
        }
    }

    onToggleZenModeClicked() {
        var zenMode = !this.state.zenMode;
        this.setState({'zenMode': zenMode});
    }
}
