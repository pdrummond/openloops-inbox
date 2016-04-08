import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class FollowLoginModal extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    	$('#follow-login-modal').modal({detachable: false});
    }

    render() {
        return (
            <div id="follow-login-modal" className="ui basic modal">
                <i className="close icon"></i>
                <div className="header">
                    Follow Group
                </div>
                <div className="image content">
                    <div className="image">
                        <i className="sign in icon"></i>
                    </div>
                    <div className="description">
                        <p>To follow this group you must sign-up or login if you already have an account?</p>
                    </div>
                </div>
                <div className="actions">
                    <div className="three fluid ui inverted buttons">
                        <div className="ui red basic inverted button" onClick={this.hide.bind(this)}>
                            <i className="remove icon"></i>
                            Cancel
                        </div>
                        <div className="ui blue basic inverted button"  onClick={this.handleLoginButtonClicked.bind(this)}>
                            <i className="sign in icon"></i>
                            Login
                        </div>
                        <div className="ui green basic inverted button"  onClick={this.handleSignupButtonClicked.bind(this)}>
                            <i className="checkmark icon"></i>
                            Sign-up
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    handleSignupButtonClicked() {
        this.hide();
    }

    handleLoginButtonClicked() {
        this.hide();
    }

    hide() {
        $('#follow-login-modal').modal('hide');
    }
}
