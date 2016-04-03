import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Subjects } from '../api/subjects.js';

import Subject from './Subject.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class SubjectList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    renderSubjects() {
        let filteredSubjects = this.props.subjects;
        if (this.state.hideCompleted) {
            filteredSubjects = filteredSubjects.filter(subject => !subject.checked);
        }
        return filteredSubjects.map((subject) => (
            <Subject key={subject._id} subject={subject} />
        ));
    }

    render() {
        return (
            <div className="container">
            <header>
                <h1>Welcome to OpenLoops ({this.props.incompleteCount})</h1>
                <label className="hide-completed">
                    <input
                    type="checkbox"
                    readOnly
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                    />
                Hide Closed Subjects
            </label>
                <AccountsUIWrapper />

                { this.props.currentUser ?
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new subjects"/>
                </form> : '' }
            </header>
            <ul>
            {this.renderSubjects()}
            </ul>
            </div>
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('subjects.insert', text);

        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
}

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('subjects');
    return {
        subjects: Subjects.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Subjects.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user()
    };
}, SubjectList);
