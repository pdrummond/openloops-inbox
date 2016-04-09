import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

class MainLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.loading) {
            return (<p>Loading...</p>);
        } else {
            console.log("currentUser:" + JSON.stringify(this.props.currentUser, null, 4));
            return (
                <div className="main-layout">

                    <div className="ui stackable menu">
                        <div className="item">
                            <img src="/images/loopy.png"/>
                        </div>
                        <a href="/home/open" className="item active">< i className="ui home icon"></i> Home</a>
                        <a href="/explore" className="item"><i className = "ui compass icon"></i> Explore</a>
                        <div className="right menu">
                            {this.renderUserButtons()}
                        </div>
                    </div>
                    <div className="main-content">
                        {this.props.main()}
                    </div>
                </div>
            );
        }
    }

    renderUserButtons() {
        if(this.props.currentUser) {
            return (
                <div className="ui dropdown item">
                    <img className="ui avatar image" src={this.props.currentUser.profileImage}/>
                    <span>{this.props.currentUser.username}</span>
                        <div className="menu">
                            <div className="item" onClick={() => {Meteor.logout()}}>Logout</div>
                        </div>
                    </div>
            );
        } else {
            return (
                <div className="ui item">
                    <div className="ui buttons">
                        <button className="ui button" onClick={()=>{FlowRouter.go('/login');}}>Login</button>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={()=>{FlowRouter.go('/join');}}>Sign-up</button>
                    </div>
                </div>
            );
        }
    }
}

export default createContainer(() => {
    var userDataHandle = Meteor.subscribe('userData');
    return {
        loading: !(userDataHandle.ready()),
        currentUser: Meteor.user()
    };
}, MainLayout);
