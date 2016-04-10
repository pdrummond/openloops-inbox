import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tabs } from '../api/tabs.js';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import Tab from './Tab.jsx';

class TabList extends Component {

    constructor(props) {
        super(props);
    }

    renderTabs() {
        return this.props.tabs.map((tab) => (
            <Tab key={tab._id} tab={tab} />
        ));
    }

    render() {
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container tab-list-wrapper">
                    <div className="ui secondary menu" style={{marginLeft:'50px'}}>
                        <a className="header item">
                            <i className="ui folder icon"></i> Tab Management for <span style={{marginLeft:'5px', color:'gray'}}> {this.props.currentGroup.domain} / {this.props.currentGroup.name}</span>
                        </a>
                        <div className="right menu">
                            <div className="item">
                                <div className="ui primary button">Create</div>
                            </div>
                        </div>
                    </div>
                    { this.props.currentUser ?
                    <form className="new-tab" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                        type="text"
                        ref="nameInput"
                        placeholder="Tab Name"/>
                    <input
                        type="text"
                        ref="labelQueryInput"
                        placeholder="Tab Labels"/>
                    <input
                        type="text"
                        ref="typeQueryInput"
                        placeholder="Tab Types"/>
                    <input
                        type="text"
                        ref="statusQueryInput"
                        placeholder="Tab Statuses"/>
                    <button type="submit">Create Label</button>
                    </form> : '' }
                    <div className="ui segment" style={{marginLeft:'50px', overflow: 'auto', height: 'calc(100% - 200px)'}}>
                        <ul className="item-list tab-list">
                            {this.renderTabs()}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        const labelQuery = ReactDOM.findDOMNode(this.refs.labelQueryInput).value.trim().split(',');
        const typeQuery = ReactDOM.findDOMNode(this.refs.typeQueryInput).value.trim().split(',');
        const statusQuery = ReactDOM.findDOMNode(this.refs.statusQueryInput).value.trim().split(',');        
        if(name.length > 0) {
            Meteor.call('tabs.insert', name, labelQuery, typeQuery, statusQuery, this.props.currentGroup._id);

            ReactDOM.findDOMNode(this.refs.nameInput).value = '';
            ReactDOM.findDOMNode(this.refs.labelQueryInput).value = '';
            ReactDOM.findDOMNode(this.refs.typeQueryInput).value = '';
            ReactDOM.findDOMNode(this.refs.statusQueryInput).value = '';
        }
    }

}

TabList.propTypes = {
    tabs: PropTypes.array.isRequired
};

export default createContainer(() => {
    var groupFilterId = FlowRouter.getParam('groupFilterId');
    var currentGroupHandle = Meteor.subscribe('currentGroup', groupFilterId);
    var tabsHandle = Meteor.subscribe('tabs', groupFilterId);
    return {
        loading: !(tabsHandle.ready() && currentGroupHandle.ready()),
        tabs: Tabs.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentUser: Meteor.user(),
        currentGroup: Groups.findOne(groupFilterId)
    };
}, TabList);
