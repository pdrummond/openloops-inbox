import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class EditGroupModal extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    	$(`#${this.props.group._id} .ui.modal`).modal({detachable: false});
    }

    showModal() {
        $(`#${this.props.group._id} .ui.modal`).modal('show');
    }

    hideModal() {
        $(`#${this.props.group._id} .ui.modal`).modal('hide');
    }

    render() {
        return (
            <span id={this.props.group._id}>
                <div className="ui mini button" onClick={this.showModal.bind(this)}><i className="edit icon"></i> Edit</div>
                <div className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Edit Group
                    </div>
                    <div className="content">
                        <form className="ui form">
                            <div className="field">
                                <label>Domain / Name</label>
                                <div className="two fields">
                                    <div className="field">
                                        <input readOnly="true" ref="domainInput" type="text" placeholder="Domain" defaultValue={this.props.group.domain}/>
                                    </div>
                                    <div className="field">
                                        <input readOnly="true" ref="nameInput" type="text" placeholder="Name" defaultValue={this.props.group.name}/>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label>Logo Image</label>
                                <input ref="logoImageUrlInput" type="text" placeholder="Enter URL for the logo image" defaultValue={this.props.group.logoImageUrl}/>
                            </div>
                            <div className="field">
                                <label>Cover Image</label>
                                <input ref="coverImageUrlInput" type="text" placeholder="Enter URL for the cover image"  defaultValue={this.props.group.coverImageUrl}/>
                            </div>
                            <div className="field">
                                <label>Description</label>
                                <textarea ref="descriptionTextArea" rows="2"  defaultValue={this.props.group.description}></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="actions">
                        <div className="ui button" onClick={this.hideModal.bind(this)}>Cancel</div>
                        <div className="ui button" onClick={this.handleOkButtonClicked.bind(this)}>OK</div>
                    </div>
                </div>
            </span>
        );
    }

    handleOkButtonClicked() {
        const domain = ReactDOM.findDOMNode(this.refs.domainInput).value.trim();
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        const description = ReactDOM.findDOMNode(this.refs.descriptionTextArea).value.trim();
        const logoImageUrlInput = ReactDOM.findDOMNode(this.refs.logoImageUrlInput).value.trim();
        const coverImageUrlInput = ReactDOM.findDOMNode(this.refs.coverImageUrlInput).value.trim();
        if(domain.length > 0 && name.length > 0) {
            Meteor.call('groups.update', this.props.group._id, domain, name, description, logoImageUrlInput, coverImageUrlInput);
            this.hideModal();
        }
    }
}
