import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Tabs} from '../api/tabs.js';

// Tab component - represents a single todo item
export default class Tab extends Component {

    toggleChecked() {
        Meteor.call('tabs.setChecked', this.props.tab._id, !this.props.tab.checked);
    }

    deleteThisTab() {
        Meteor.call('tabs.remove', this.props.tab._id);
    }

    render() {
        const tabClassName = this.props.tab.checked ? 'checked' : '';

        return (
            <li className={tabClassName}>
                <button className="delete" onClick={this.deleteThisTab.bind(this)}>
                    &times;
                </button>

                {/*<input
                    type="checkbox"
                    readOnly
                    checked={this.props.tab.checked}
                    onClick={this.toggleChecked.bind(this)}
                    />*/}
                {this.renderTabLink()}
            </li>
        );
    }

    renderTabLink() {
        return (
            <a href="">
                <span className="ui item">
                    <i className="folder icon"></i>
                    {this.props.tab.text} - labels: <strong>{this.props.tab.labelQuery}</strong> - type: <strong>{this.props.tab.typeQuery}</strong> - status: <strong>{this.props.tab.statusQuery}</strong>
                </span>
            </a>
        );
    }
}

Tab.propTypes = {
    // This component gets the tab to display through a React prop.
    // We can use propTypes to indicate it is required
    tab: PropTypes.object.isRequired,
};
