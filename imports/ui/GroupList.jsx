import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import Group from './Group.jsx';

class GroupList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    renderGroups() {
        let filteredGroups = this.props.groups;
        if (this.state.hideCompleted) {
            filteredGroups = filteredGroups.filter(group => !group.checked);
        }
        return filteredGroups.map((group) => (
            <Group key={group._id} group={group} />
        ));
    }

    render() {
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container group-list-wrapper">
                <header>
                    <label className="hide-completed">
                        <input
                        type="checkbox"
                        readOnly
                        checked={this.state.hideCompleted}
                        onClick={this.toggleHideCompleted.bind(this)}
                        />
                    Hide Closed Groups
                </label>

                    { this.props.currentUser ?
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
                <div className="ui segment" style={{margin:'50px', overflow: 'auto', height: 'calc(100% - 200px)'}}>
                <ul className="item-list group-list">
                    {this.renderGroups()}
                </ul>
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

GroupList.propTypes = {
    groups: PropTypes.array.isRequired
};

export default createContainer(() => {
    var groupsHandle = Meteor.subscribe('allGroups');
    return {
        loading: !(groupsHandle.ready()),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentUser: Meteor.user()
    };
}, GroupList);
