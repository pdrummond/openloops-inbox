import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import GroupGridCell from './GroupGridCell.jsx';
import UserGroupGridCell from './UserGroupGridCell.jsx';

class GroupGrid extends Component {

    constructor(props) {
        super(props);
    }

    renderGroupCells() {
        let filteredGroups = this.props.groups.filter(group => group.type == 'group');
        return filteredGroups.map((group) => (
            <GroupGridCell key={group._id} group={group} />
        ));
    }

    renderUserGroupCells() {
        let filteredGroups = this.props.groups.filter(group => group.type == 'user');
        return filteredGroups.map((group) => (
            <UserGroupGridCell key={group._id} group={group} />
        ));
    }

    render() {
        if(this.props.loading) {
            return (<p>Loading...</p>);
        } else {
            return (
                <div className="container group-list-wrapper">
                    <header>
                        { this.props.currentUser.username == 'pdrummond' ?
                            <form className="new-group" onSubmit={this.handleSubmit.bind(this)} >
                                <input
                                    type="text"
                                    ref="domainInput"
                                    placeholder="Group Domain"/>
                                <input
                                    type="text"
                                    ref="nameInput"
                                    placeholder="Group Name"/>
                                <button type="submit">Create Group</button>
                            </form> : '' }
                        </header>
                        <div style={{margin:'50px'}}>
                            <div className="ui one column grid">
                                <div className="column">
                                    <h2 className="ui header">
                                        <span> <i className="ui circular star icon"></i> Featured Groups </span>
                                    </h2>
                                    <div className="ui secondary segment">
                                        <ul className="ui cards group-grid">
                                            {this.renderGroupCells()}
                                        </ul>
                                    </div>
                                </div>
                                <div className="column">
                                    <h2 className="ui header">
                                        <span> <i className="ui circular user icon"></i> Top Users </span>
                                    </h2>
                                    <div className="ui secondary segment">
                                        <ul className="ui cards group-grid">
                                            {this.renderUserGroupCells()}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                }
            }

            handleSubmit(event) {
                event.preventDefault();

                const domain = ReactDOM.findDOMNode(this.refs.domainInput).value.trim();
                const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
                if(domain.length > 0 && name.length > 0) {
                    Meteor.call('groups.insert', domain, name, 'group');

                    ReactDOM.findDOMNode(this.refs.domainInput).value = '';
                    ReactDOM.findDOMNode(this.refs.nameInput).value = '';
                }
            }

            toggleHideCompleted() {
                this.setState({
                    hideCompleted: !this.state.hideCompleted,
                });
            }
}

GroupGrid.propTypes = {
    groups: PropTypes.array.isRequired
};

export default createContainer(() => {
    var groupsHandle = Meteor.subscribe('groups');
    var userDataHandle = Meteor.subscribe('userData');
    return {
        loading: !(groupsHandle.ready() && userDataHandle.ready()),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentUser: Meteor.user()
    };
}, GroupGrid);
