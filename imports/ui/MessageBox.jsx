import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';

import { Subjects } from '../api/subjects.js';

export default class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectType: 'discussion',
            content: '',
            zenMode: false,
            createOnEnter: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.groupFilterId != nextProps.groupFilterId) {
            $(".to-dropdown").dropdown('set selected', nextProps.groupFilterId);
        }
        if(nextProps.groupFilterId == null) {
            $(".to-dropdown").dropdown('clear');
        }
    }

    componentDidMount() {
        var self = this;
        if(this.props.groupFilterId) {
            $(".to-dropdown").dropdown('set selected', this.props.groupFilterId);
        }
        $('.subject-type-dropdown').dropdown({
            onChange: (type) => {
                self.setState({
                    subjectType: type,
                })
            }
        });
    }

    getToFieldClassName() {
        let className = "to-dropdown ui fluid search selection dropdown";
        if(this.props.groupFilterId != null) {
            className += " disabled";
        }
        return className;
    }

    render() {
        return (
            <div className="message-box" style={{top: (this.state.zenMode?'85px':'auto')}}>
                <div style={{display:'flex', width:'100%', padding:'10px 0px'}}>
                    <div className="subject-type-dropdown ui icon top left pointing dropdown button" style={{height:'38px', marginRight:'-3px', backgroundColor:'whitesmoke', border:'none'}}>
                        <i className={Subjects.helpers.getSubjectTypeIconClassName(this.state.subjectType)}></i>
                        <div className="menu">
                            <div className="item" data-value="discussion"><i className="comments icon"></i> Discussion</div>
                            <div className="item" data-value="story"><i className="newspaper icon"></i> Story</div>
                            <div className="item" data-value="journal"><i className="book icon"></i> Journal</div>
                            <div className="divider"></div>
                            <div className="item" data-value="task"><i className="warning circle icon"></i> Task</div>
                            <div className="item" data-value="feature"><i className="bullseye icon"></i> Feature</div>
                            <div className="item" data-value="problem"><i className="bomb icon"></i> Problem</div>
                            <div className="item" data-value="bug"><i className="bug icon"></i> Bug</div>
                            <div className="divider"></div>
                            <div className="item" data-value="question"><i className="help circle icon"></i> Question</div>
                            <div className="item" data-value="idea"><i className="lightning icon"></i> Idea</div>
                            <div className="divider"></div>
                            <div className="item" data-value="announcement"><i className="announcement icon"></i> Announcement</div>
                            <div className="divider"></div>
                            <div className="item" data-value="channel"><i className="square icon"></i> Channel</div>
                        </div>
                    </div>
                    <input ref="subjectRef" autofocus="autofocus" placeholder="Subject" style={{marginRight:'10px', height:'38px'}}/>

                    <div className={this.getToFieldClassName()} style={{height:'38px', backgroundColor:'whitesmoke', border:'none'}}>
                        <input ref="groupRef" type="hidden"/>
                        <i className="dropdown icon"></i>
                        <div className="default text">To</div>
                        <div className="menu">
                            {this.renderToDropdownItems()}
                        </div>
                    </div>

                </div>
                <textarea style={{height: (this.state.zenMode?'calc(100% - 104px)':'150px')}}
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

    renderToDropdownItems() {
        return this.props.groups.map((group) => (
            <div key={group._id} className="item" data-value={group._id}>
                <i className={group.type == 'group' ? 'block layout icon' : 'user icon'}></i>
                {group.type == 'group' ? group.domain + "/" + group.name : group.domain}
            </div>
        ));
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
        const groupId = ReactDOM.findDOMNode(this.refs.groupRef).value.trim();

        if(subject.length > 0 && groupId.length > 0) {
            Meteor.call('subjects.insert', subject, groupId, this.state.subjectType, function(err, subjectId) {
                if(err) {
                    alert("Error adding subject: " + err.reason);
                } else {
                    ReactDOM.findDOMNode(this.refs.subjectRef).value = '';
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
