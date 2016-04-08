import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class CreateGroupModal extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    	$('#create-group-modal .ui.modal').modal({detachable: false});
    }

    showModal() {
        $('#create-group-modal .ui.modal').modal('show');
    }

    hideModal() {
        $('#create-group-modal .ui.modal').modal('hide');
    }

    render() {
        return (
            <div id="create-group-modal">
                <button className="ui green button" onClick={this.showModal}>Create Group</button>
                <div className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        Create Group
                    </div>
                    <div className="content">
                        <form className="ui form">
                            <div className="field">
                                <label>Domain / Name</label>
                                <div className="two fields">
                                    <div className="field">
                                        <input ref="domainInput" type="text" placeholder="Domain"/>
                                    </div>
                                    <div className="field">
                                        <input ref="nameInput" type="text" placeholder="Name"/>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label>Logo Image</label>
                                <input ref="logoImageUrlInput" type="text" placeholder="Enter URL for the logo image"/>
                            </div>
                            <div className="field">
                                <label>Cover Image</label>
                                <input ref="coverImageUrlInput" type="text" placeholder="Enter URL for the cover image"/>
                            </div>
                            <div className="field">
                                <label>Description</label>
                                <textarea ref="descriptionTextArea" rows="2"></textarea>
                            </div>                            
                        </form>
                    </div>
                    <div className="actions">
                        <div className="ui button" onClick={()=> { this.hideModal()}}>Cancel</div>
                        <div className="ui button" onClick={this.handleOkButtonClicked.bind(this)}>OK</div>
                    </div>
                </div>
            </div>
        );
    }

    handleOkButtonClicked() {
        const domain = ReactDOM.findDOMNode(this.refs.domainInput).value.trim();
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        const description = ReactDOM.findDOMNode(this.refs.descriptionTextArea).value.trim();
        const logoImageUrlInput = ReactDOM.findDOMNode(this.refs.logoImageUrlInput).value.trim();
        const coverImageUrlInput = ReactDOM.findDOMNode(this.refs.coverImageUrlInput).value.trim();
        if(domain.length > 0 && name.length > 0) {
            Meteor.call('groups.insert', domain, name, description, logoImageUrlInput, coverImageUrlInput, 'group');

            ReactDOM.findDOMNode(this.refs.domainInput).value = '';
            ReactDOM.findDOMNode(this.refs.nameInput).value = '';
            ReactDOM.findDOMNode(this.refs.descriptionTextArea).value = '';
            ReactDOM.findDOMNode(this.refs.logoImageUrlInput).value = '';
            ReactDOM.findDOMNode(this.refs.coverImageUrlInput).value = '';
            this.hideModal();
        }
    }
}
