import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';
import { Messages } from '../api/messages.js';
import { Labels } from '../api/labels.js';

import SubjectLabelsSidebar from './SubjectLabelsSidebar.jsx';
import CommentMessageBox from './CommentMessageBox.jsx';
import Message from './Message.jsx';


class MessageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    componentDidUpdate() {
        var self = this;
        $("#public-card").popup();
        $('.ui.dropdown').dropdown('refresh');
        $('.status-dropdown').dropdown('set selected', self.props.currentSubject.status);
        $('.status-dropdown').dropdown({
            onChange: (status) => {
                Meteor.call('subjects.updateStatus', self.props.currentSubject._id, status);

            }
        });
        $('.type-dropdown').dropdown('set selected', self.props.currentSubject.type);
        $('.type-dropdown').dropdown({
            onChange: (type) => {
                Meteor.call('subjects.updateType', self.props.currentSubject._id, type);

            }
        });
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
            return (<p>Loading...</p>);
        } else {
            return (
                <div className="container message-list" style={{marginLeft:'10px'}}>
                    <header>
                        <h1>
                            <i className={Subjects.helpers.getSubjectTypeIconClassName(this.props.currentSubject.type)} style={{fontSize:'2em', position:'relative', top:'7px', color: Subjects.helpers.getSubjectTypeIconColor(this.props.currentSubject.type)}}></i> {this.props.currentSubject.text}
                            </h1>
                            <p >
                                {this.renderStatusButton()} <span style={{color:'gray'}}>From <strong>{this.props.currentSubject.username}</strong> to <strong>{this.renderToLabel()}</strong> {moment(this.props.currentSubject.createdAt).fromNow()}</span>
                        </p>
                    </header>

                    <div style={{marginTop:'20px', paddingRight:'350px', height:'100%'}}>
                        <div ref="messageList" className="ui segment" style={{overflow: 'auto', height: this.props.currentUser?'calc(100% - 250px)':'calc(100% - 6px)'}}>
                            <ul className="ui feed">
                                {/*<div className="event">
                                <div className="label">
                                <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg"/>
                                </div>
                                <div className="content">
                                <div className="summary">
                                <a className="user">
                                Harold Faker
                                </a> added label <a className="ui red label">can't-reproduce</a>
                                <div className="date">
                                1 Hour Ago
                                </div>
                                </div>
                                <div className="meta">
                                <a className="like">
                                <i className="like icon"></i> 4 Likes
                                </a>
                                </div>
                                </div>
                                </div>
                                <div className="event">
                                <div className="label">
                                <img src="http://semantic-ui.com/images/avatar/small/helen.jpg"/>
                                </div>
                                <div className="content">
                                <div className="summary">
                                <a>Helen Troy</a> added <a>2 new images</a>
                                <div className="date">
                                4 days ago
                                </div>
                                </div>
                                <div className="extra images">
                                <a><img src="http://semantic-ui.com/images/wireframe/image.png"/></a>
                                <a><img src="http://semantic-ui.com/images/wireframe/image.png"/></a>
                                </div>
                                <div className="meta">
                                <a className="like">
                                <i className="like icon"></i> 1 Like
                                </a>
                                </div>
                                </div>
                                </div>*/}
                                {this.renderMessages()}
                                {this.renderSignUpMessage()}
                            </ul>
                            {this.renderMessageBox()}
                        </div>
                        <div className="subject-right-sidebar ui segment">
                                <SubjectLabelsSidebar currentSubject={this.props.currentSubject} groupLabels={this.props.groupLabels}/>
                                <h5 className="ui disabled header">
                                    <span><i className="ui circle icon"></i> TYPE</span>
                                </h5>
                                <select className="type-dropdown ui fluid dropdown">
                                    <option value="discussion">Discussion</option>
                                    <option value="story">Story</option>
                                    <option value="journal">Journal</option>
                                    <option value="task">Task</option>
                                    <option value="feature">Feature</option>
                                    <option value="problem">Problem</option>
                                    <option value="bug">Bug</option>
                                    <option value="question">Question</option>
                                    <option value="idea">Idea</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="channel">Channel</option>
                                </select>

                                <h5 className="ui disabled header">
                                    <span><i className="ui square icon"></i> STATUS</span>
                                </h5>
                                <select className="status-dropdown ui fluid dropdown">
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>

                                <h5 className="ui disabled header">
                                    <span><i className="ui users icon"></i> WHO CAN SEE THIS?</span>
                                </h5>
                                <div className="ui vertical segment">
                                    <div id="public-card" className="ui card" data-content="This is a public group which means anyone - even users without an account - can see this and it can appear in search engines too.">
                                        <div className="content">
                                            <i className="right floated big purple world icon"></i>
                                            <div className="content">
                                                <strong>The Public</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui card">
                                        <div className="content">
                                            <img className="right floated mini ui image" src="http://semantic-ui.com/images/avatar/small/elliot.jpg"/>
                                            <div className="content">
                                                <strong>Paul Drummond</strong>
                                            </div>
                                            <div className="meta">
                                                <i className="green circle icon"></i>
                                                Online, here
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui card">
                                        <div className="content">
                                            <img className="right floated mini ui image" src="http://semantic-ui.com/images/avatar/large/jenny.jpg"/>
                                            <div className="content">
                                                <strong>Jenny Hess</strong>
                                            </div>
                                            <div className="meta">
                                                <i className="orange circle icon"></i>
                                                Online, elsewhere
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui card">
                                        <div className="content">
                                            <img className="right floated mini ui image" src="http://semantic-ui.com/images/avatar2/large/matthew.png"/>
                                            <div className="content">
                                                <strong>Matt Giampietro</strong>
                                            </div>
                                            <div className="meta">
                                                <i className="red circle icon"></i>
                                                Offline
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            }
        }

        renderStatusButton() {
            if(this.props.currentSubject.status == 'closed') {
                return (
                    <button className="ui tiny red button">Closed</button>
                );
            } else {
                return (
                    <button className="ui tiny green button">Open</button>
                );
            }
        }

        renderSignUpMessage() {
            if(!this.props.currentUser) {
                return (
                    <div className="ui icon message">
                        <i className="sign in icon"></i>
                        <div className="content">
                            <p>Want to comment on this conversation or start your own?</p>
                            <div className="ui buttons">
                                <a href="/join" className="ui positive button">Sign-up for FREE!</a>
                                <div className="or"></div>
                                <a href="/login" className="ui button">Login if you already have an account</a>
                            </div>

                        </div>
                    </div>
                );
            }
        }

        renderMessageBox() {
            if(this.props.currentUser != null) {
                return (
                    <CommentMessageBox
                        onMessageCreated={this.scrollBottom.bind(this)}
                        currentSubject={this.props.currentSubject}
                        />
                );
            }
        }

        renderToLabel() {
            var group = Groups.findOne(this.props.currentSubject.groupId);
            var toLabel ='??';
            if(group != null) {
                toLabel = group.type == 'group' ? group.domain + "/" + group.name : group.domain;
            }
            return toLabel;
        }

        toggleHideCompleted() {
            this.setState({
                hideCompleted: !this.state.hideCompleted,
            });
        }

        scrollBottom(callback) {
            var self = this;
            setTimeout(function() {
                let node = ReactDOM.findDOMNode(self.refs.messageList);
                node.scrollTop = node.scrollHeight;
                if(callback) {
                    callback();
                }
            }, 20);
        }
    }

    MessageList.propTypes = {
        messages: PropTypes.array.isRequired,
        incompleteCount: PropTypes.number.isRequired,
    };

    export default createContainer(() => {
        var subjectId = FlowRouter.getParam('subjectId');
        var groupsHandle = Meteor.subscribe('allGroups');
        var messagesHandle = Meteor.subscribe('messages', subjectId);
        var subjectHandle = Meteor.subscribe('currentSubject', subjectId);
        var userDataHandle = Meteor.subscribe('userData');
        var labelsHandle = Meteor.subscribe('subjectGroupLabels', subjectId);
        return {
            loading: !(groupsHandle.ready() && messagesHandle.ready() && subjectHandle.ready() && userDataHandle.ready() && labelsHandle),
            groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
            messages: Messages.find({}, { sort: { createdAt: 1 } }).fetch(),
            incompleteCount: Messages.find({ checked: { $ne: true } }).count(),
            currentUser: Meteor.user(),
            currentSubject: Subjects.findOne(subjectId),
            groupLabels: Labels.find().fetch()
        };
    }, MessageList);
