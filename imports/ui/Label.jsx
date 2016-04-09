import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Labels} from '../api/labels.js';

// Label component - represents a single todo item
export default class Label extends Component {

    toggleChecked() {
        Meteor.call('labels.setChecked', this.props.label._id, !this.props.label.checked);
    }

    deleteThisLabel() {
        Meteor.call('labels.remove', this.props.label._id);
    }

    render() {
        const labelClassName = this.props.label.checked ? 'checked' : '';

        return (
            <li className={labelClassName}>
                <button className="delete" onClick={this.deleteThisLabel.bind(this)}>
                    &times;
                </button>

                {/*<input
                    type="checkbox"
                    readOnly
                    checked={this.props.label.checked}
                    onClick={this.toggleChecked.bind(this)}
                    />*/}
                {this.renderLabelLink()}
            </li>
        );
    }

    renderLabelLink() {
        return (
            <a href="">
                <span className="ui label" style={{color:'white', backgroundColor: this.props.label.color}}>
                    <i className="tag icon"></i>
                    {this.props.label.text}
                </span>
                <span style={{marginLeft:'10px'}}>{this.props.label.description}</span>
            </a>
        );
    }
}

Label.propTypes = {
    // This component gets the label to display through a React prop.
    // We can use propTypes to indicate it is required
    label: PropTypes.object.isRequired,
};
