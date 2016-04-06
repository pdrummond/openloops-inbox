import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Groups} from '../api/groups.js';

export default class GroupGridCell extends Component {

    toggleChecked() {
        Meteor.call('groups.setChecked', this.props.group._id, !this.props.group.checked);
    }

    deleteThisGroup() {
        Meteor.call('groups.remove', this.props.group._id);
    }

    render() {
        const groupClassName = this.props.group.checked ? 'checked' : '';

        return (
            <div className="ui card">
                <div className="content">
                    <img className="ui avatar image" src={this.props.group.domain == 'openloops'?'https://www.openloopz.com/images/openloopz-o.png':'http://iode.co.uk/images/iode-o-logo-final-lowRes.png'}>
                    </img>
                    <strong>{this.props.group.domain} / {this.props.group.name}</strong>
                </div>
                <div className="image">
                    <img style={{maxHeight:'160px'}} src={this.props.group.domain == 'openloops'?'https://lh3.googleusercontent.com/tCHpDXLENsjJ88yf0iE0HZvvEr0_l0n6Ugin1EW64Bqw9LZkTsR0N3bdM8Hyuk0Ld58=s630-fcrop64=1,2bf40000e4f2ff67':'/images/iode-logo.png'}>
                    </img>
                </div>
                <div className="content">
                    <div className="description">
                        This is the group for development chat only.
                    </div>
                </div>
                <div className="content">
                    <span className="right floated">
                        <i className="heart outline like icon"></i>
                        17 likes
                    </span>
                    <i className="user icon"></i>
                    3000 members
                </div>
                <div className="extra content">

                    <div className="ui two buttons">
                        <div className="ui basic green button"><i className="checkmark icon"></i> Join</div>
                        <div className="ui basic blue button"><i className="plus icon"></i> Follow</div>
                    </div>

                </div>
            </div>
        );
    }
}

GroupGridCell.propTypes = {
    // This component gets the group to display through a React prop.
    // We can use propTypes to indicate it is required
    group: PropTypes.object.isRequired,
};