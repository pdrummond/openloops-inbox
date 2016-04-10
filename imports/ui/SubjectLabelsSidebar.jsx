import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SubjectLabelsSidebar extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $("#subject-label-dropdown").dropdown({action:'nothing'});
    }

    render() {
        return (
            <div id="subject-labels-sidebar" style={{position:'relative'}}>
                <h5 className="ui disabled header">
                    <span><i className="ui tag icon"></i> LABELS</span>

                </h5>
                <span id="subject-label-dropdown" className="ui icon right pointing inline dropdown" style={{position:'absolute', top:'0px', right:'0px'}}>
                    <i className="cogs grey icon"></i>
                    <div className="menu">
                        <div className="header">
                            Choose Labels
                        </div>
                        <div className="ui left icon input">
                            <i className="search icon"></i>
                            <input type="text" name="search" placeholder="Search..."/>
                        </div>
                        {this.props.groupLabels.map((label) => (
                            <div key={label._id} data-id={label._id} className="item" onClick={this.handleLabelClicked.bind(this)}>
                                <span data-id={label._id} className="ui label" style={{backgroundColor: label.color, color:'white'}}>{label.text}</span>
                                <i data-id={label._id} className="ui checkmark icon" style={{float:'right', margin: '5px 0px', display:this.isSubjectLabel(label)?'inline-block':'none'}}></i>
                            </div>
                            ))
                        }

                    </div>
                </span>
                <div className="ui segment">
                    {this.renderSubjectLabels()}
                </div>
            <h5 className="ui disabled header">
                <span><i className="ui user icon"></i> ASSIGNEE</span>
            </h5>
            <div className="ui card">
                <div className="content">
                    <img className="right floated mini ui image" src="http://semantic-ui.com/images/avatar/small/elliot.jpg"/>
                    <div className="header">
                        Paul Drummond
                    </div>
                    <div className="meta">
                        Developer
                    </div>

                </div>
            </div>
        </div>
    );
    }

    renderSubjectLabels() {
        if(this.props.currentSubject.labels && this.props.currentSubject.labels.length > 0) {
            const subjectLabels = this.props.currentSubject.labels.map((labelId) => {
                return _.findWhere(this.props.groupLabels, {_id: labelId});
            });
            return (
                <div className="ui divided selection list">
                    {subjectLabels.map((label) => (
                        <a key={label._id} className="item">
                            <div className="ui fluid horizontal label" style={{backgroundColor: label.color, color:'white'}}>{label.text}</div>
                        </a>
                        ))
                    }
                </div>
            );
        } else {
            return (
                <div className="ui divided selection list">
                    <div className="item">This subject has no labels.</div>
                </div>
            );
        }
    }

    handleLabelClicked(e) {
        var labelId = $(e.target).attr('data-id');
        Meteor.call('subjects.toggleLabel', this.props.currentSubject._id, labelId);
    }

    isSubjectLabel(label) {
        return _.contains(this.props.currentSubject.labels, label._id);
    }
}
