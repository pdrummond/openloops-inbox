import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import {Subjects} from '../api/subjects.js';

// Subject component - represents a single todo item
export default class Subject extends Component {

    toggleChecked() {
        Meteor.call('subjects.setChecked', this.props.subject._id, !this.props.subject.checked);
    }

    deleteThisSubject() {
         Meteor.call('subjects.remove', this.props.subject._id);
    }

    render() {
    // Give subjects a different className when they are checked off,
    // so that we can style them nicely in CSS
    const subjectClassName = this.props.subject.checked ? 'checked' : '';

    return (
      <li className={subjectClassName}>
        <button className="delete" onClick={this.deleteThisSubject.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.subject.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        <a href={`/subject/${this.props.subject._id}`}><span className="text">
            <strong>{this.props.subject.text}</strong>
        </span></a>
     </li>
    );
  }

}

Subject.propTypes = {
    // This component gets the subject to display through a React prop.
    // We can use propTypes to indicate it is required
    subject: PropTypes.object.isRequired,
};
