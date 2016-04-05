import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Subjects} from '../api/subjects.js';
import {Groups} from '../api/groups.js';

// Subject component - represents a single todo item
export default class Subject extends Component {

    toggleChecked() {
        Meteor.call('subjects.updateStatus', this.props.subject._id, this.props.subject.status == 'open'?'closed':'open');
    }

    deleteThisSubject() {
        Meteor.call('subjects.remove', this.props.subject._id);
    }

    render() {
        const subjectClassName = this.props.subject.status == 'closed' ? 'checked' : '';

        return (
            <li className={subjectClassName}>
                <button className="delete" onClick={this.deleteThisSubject.bind(this)}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly
                    checked={this.props.subject.status == 'closed'}
                    onClick={this.toggleChecked.bind(this)}
                    />
                <i className={Subjects.helpers.getSubjectTypeIconClassName(this.props.subject.type)} style={{marginLeft:'20px', color:'gray', fontSize:'16px'}}></i>

                <a href={`/subject/${this.props.subject._id}`}><span className="text">
                    <strong>{this.props.subject.text}</strong>
                    {this.renderToField()}
                </span></a>
            </li>
        );
    }

    renderToField() {
        var group = Groups.findOne(this.props.subject.groupId);
        if(group != null) {
            var toLabel = group.type == 'group' ? group.domain + "/" + group.name : group.domain;
            return <span style={{fontSize:'12px', marginLeft:'5px', color:'#B0B0B0'}}> from <strong>{this.props.subject.username}</strong> to <strong>{toLabel}</strong></span>;
            }
        }

    }

    Subject.propTypes = {
        // This component gets the subject to display through a React prop.
        // We can use propTypes to indicate it is required
        subject: PropTypes.object.isRequired,
    };
