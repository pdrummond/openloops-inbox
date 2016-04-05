import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';

export default class CommentMessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            zenMode: false,
            createOnEnter: false,
        };
    }

    render() {
        return (
            <div className="message-box" style={{top: (this.state.zenMode?'165px':'auto'), width: (this.state.zenMode?'calc(100% - 40px)':'calc(100% - 400px)')}}>
                <textarea style={{height: (this.state.zenMode?'calc(100% - 40px)':'150px')}}
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
                this.doCreateMessage();
            }
        }
    }

    onCreateSubjectClicked() {
        this.doCreateMessage();
    }

    doCreateMessage() {
        const messageText = this.state.content.trim();
        if(messageText.length > 0) {
            Meteor.call('messages.insert', messageText, this.props.currentSubject._id, function(err) {
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
