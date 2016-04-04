import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import Subject from './Subject.jsx';
import MessageBox from './MessageBox.jsx';

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

    componentDidUpdate() {
        $('.ui.dropdown').dropdown('refresh');
    }


    render() {
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container subject-list-wrapper">
                    <div>
                        <header>
                            <label className="hide-completed">
                                <input
                                type="checkbox"
                                readOnly
                                checked={this.state.hideCompleted}
                                onClick={this.toggleHideCompleted.bind(this)}
                                />
                            Hide Closed Subjects
                        </label>


                            {this.renderMessageBox()}
                        </header>
                    </div>
                    <div className="item-list subject-list ui segment">
                        <ul>
                        {this.renderSubjects()}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    renderMessageBox() {
        if(this.props.currentUser) {
            return <MessageBox groups={this.props.groups}/>;
        }
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
    var groupsHandle = Meteor.subscribe('groups');
    var subjectsHandleReady = false;
    if(Meteor.user()) {
        var subjectsHandle = Meteor.subscribe('subjects', Meteor.user().username);
        subjectsHandleReady = subjectsHandle.ready();
    } else {
        subjectsHandleReady = true;
    }
    return {
        loading: !(groupsHandle.ready() && subjectsHandleReady),
        groups: Groups.find({}, { sort: { createdAt: 1 } }).fetch(),
        subjects: Subjects.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Subjects.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user()
    };
}, SubjectList);
