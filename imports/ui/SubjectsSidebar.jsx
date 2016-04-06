import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SubjectsSidebar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    render() {
        return (
            <div className="ui vertical menu" style={{position:'fixed', width: '235px', left:'10px', top: '55px', margin:'30px 10px', height:'calc(100% - 105px)'}}>
                <a href="/home/inbox" className={this.props.homeSection=='inbox' ? "teal item active" : "teal item"}>
                    Open
                    {/*<div className="ui teal pointing left label">1</div>*/}
                </a>
                <a href="/home/closed"  className={this.props.homeSection=='closed' ? "teal item active" : "teal item"}>
                    Closed
                    {/*<div className="ui label">1</div>*/}
                </a>
                {/*<a href="/home/drafts"  className={this.props.homeSection=='drafts' ? "teal item active" : "teal item"}>
                    Drafts
                    <div className="ui label">1</div>
                </a>*/}
                {/*<div className="item">
                    <div className="ui transparent icon input">
                        <input type="text" placeholder="Search.."/>
                        <i className="search icon"></i>
                    </div>
                </div>*/}
                <div className="item">
                    <div className="header">People</div>
                    <div className="menu">
                        {this.renderUserItems()}
                    </div>
                </div>
                <div className="item">
                    <div className="header">Groups</div>
                    <div className="menu">
                        {this.renderGroupItems()}
                    </div>
                </div>
            </div>
        );
    }

    renderGroupItems() {
        const groups = this.props.groups.filter((group) => group.type == 'group');
        return groups.map((group) => (
            <a href={`/home/group/${group._id}`} key={group._id} className={this.props.groupFilterId == group._id ? 'active item' : 'item'}>
                <i className="ui block layout icon"></i> {group.domain} / {group.name}
            </a>
        ));
    }

    renderUserItems() {
        const userGroups = this.props.groups.filter((group) => group.type == 'user');
        return userGroups.map((group) => (
            <a href={`/home/group/${group._id}`} key={group._id} className="item"><i className="ui user icon"></i> {group.domain}</a>
        ));
    }
}
