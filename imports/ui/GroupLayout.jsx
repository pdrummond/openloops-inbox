import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class GroupLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-layout">

            <div className="ui stackable menu">
            <div className="item">
            <img src="/images/loopy.png"/>
            </div>
            <a href="/" className="item active">Home</a>
            <a href="/groups" className="item">Groups</a>
            <a className="item">Profile</a>

            <div className="right menu">
            <a className="ui item">
            <AccountsUIWrapper />
            </a>
            <div className="ui  dropdown item">
                <i className="help circle icon"></i> Help
                <i className="dropdown icon"></i>
                <div className="menu">
                  <div className="item">Help</div>
                <div className="item">Guided Tour</div>
                </div>
              </div>
            </div>
            </div>

        <div className="main-content" style={{left:'10px'}}>
            {this.props.main()}
        </div>

        </div>
        );
    }
}
