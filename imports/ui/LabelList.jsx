import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Labels } from '../api/labels.js';
import { Groups } from '../api/groups.js';
import { Subjects } from '../api/subjects.js';

import Label from './Label.jsx';

class LabelList extends Component {

    constructor(props) {
        super(props);
    }

    renderLabels() {
        return this.props.labels.map((label) => (
            <Label key={label._id} label={label} />
        ));
    }

    render() {
        if(this.props.loading) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="container label-list-wrapper">
                <header>
                    { this.props.currentUser ?
                    <form className="new-label" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                        type="text"
                        ref="nameInput"
                        placeholder="Label Name"/>
                    <input
                        type="text"
                        ref="colorInput"
                        placeholder="Label Color"/>
                    <input style={{width:'800px'}}
                        type="text"
                        ref="descInput"
                        placeholder="Label Description"/>
                    <button type="submit">Create Label</button>
                    </form> : '' }
                </header>
                <div className="ui segment" style={{margin:'50px', overflow: 'auto', height: 'calc(100% - 200px)'}}>
                <ul className="item-list label-list">
                    {this.renderLabels()}
                </ul>
                </div>
                </div>
            );
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        const color = ReactDOM.findDOMNode(this.refs.colorInput).value.trim();
        const desc = ReactDOM.findDOMNode(this.refs.descInput).value.trim();
        if(name.length > 0) {
            Meteor.call('labels.insert', name, color, desc, this.props.currentGroup._id);

            ReactDOM.findDOMNode(this.refs.nameInput).value = '';
            ReactDOM.findDOMNode(this.refs.colorInput).value = '';
            ReactDOM.findDOMNode(this.refs.descInput).value = '';
        }
    }

}

LabelList.propTypes = {
    labels: PropTypes.array.isRequired
};

export default createContainer(() => {
    var groupFilterId = FlowRouter.getParam('groupFilterId');
    var currentGroupHandle = Meteor.subscribe('currentGroup', groupFilterId);
    var labelsHandle = Meteor.subscribe('labels', groupFilterId);
    return {
        loading: !(labelsHandle.ready() && currentGroupHandle.ready()),
        labels: Labels.find({}, { sort: { createdAt: 1 } }).fetch(),
        currentUser: Meteor.user(),
        currentGroup: Groups.findOne(groupFilterId)
    };
}, LabelList);
