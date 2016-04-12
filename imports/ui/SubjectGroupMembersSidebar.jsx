import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SubjectLabelsSidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ui vertical segment">
                
                {this.renderGroupMemberCards()}
            </div>
        );
    }

    renderGroupMemberCards() {
        return this.props.groupMembers.map((member) => {
            let memberUser = Meteor.users.findOne(member.userId);
            return (
                <div key={member._id} className="ui card">
                    <div className="content">
                        <img className="right floated mini ui image" src={memberUser.profileImage}/>
                        <div className="content">
                            <strong>{member.username}</strong>
                        </div>
                        {/*<div className="meta">
                            <i className="green circle icon"></i>
                            Online, here
                        </div>*/}
                    </div>
                </div>
            );
        })
    }
}
