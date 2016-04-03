import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class MainLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-layout">

            <div className="ui stackable menu">
            <div className="item">
            <img src="/images/logo.png"/>
            </div>
            <a className="item active">Home</a>
            <a className="item">Groups</a>
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
            <div className="ui vertical menu" style={{margin:'30px'}}>
  <a className="teal item active">
    Inbox
    <div className="ui teal pointing left label">1</div>
  </a>
  <a className="item">
    Closes
    <div className="ui label">51</div>
  </a>
  <a className="item">
    Drafts
    <div className="ui label">1</div>
  </a>
  <div className="item">
    <div className="ui transparent icon input">
      <input type="text" placeholder="Search.."/>
      <i className="search icon"></i>
    </div>
  </div>
  <div className="item">
   <div className="header">Favourite Groups</div>
   <div className="menu">
     <a className="item">OpenLoops</a>
     <a className="item">Nissan / bs-web</a>
     <a className="item">Nissan / CMP</a>
   </div>
 </div>
</div>


        <div className="main-content">
            {this.props.main()}
        </div>

        </div>
        );
    }
}
