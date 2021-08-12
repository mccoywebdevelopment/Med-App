import React from 'react';
import { connect } from 'react-redux';
import { createMessage } from '../../../actions/messages';
import { formatPhoneNumber } from '../../../config/helpers';
import { fetchUpdateProfile } from "../../../actions/auth";

import UserHeader from '../../../components/user/header/UserHeader';

class Settings extends React.Component {
    state = {
        values: {
            isNotifications: false,
            email: this.props.auth.user.username,
            name:this.props.auth.user.name,
            phoneNumber:this.props.auth.user.phoneNumber,

            notifications:this.props.auth.user.notifications
        }
    }
    constructor(props) {
        super(props);
    }
    _update = (key, value) => {
        let newState = this.state;
        newState.values[key] = value;
        this.setState(newState);
    }
    _updateNotifications = (value) =>{
        let body = {
            _id:this.props.auth.user._id,
            notifications:{
                type:'email',
                recieve:value
            }
        }
        this.props.fetchUpdateProfile(body,(res)=>{
            let newState = this.state;
            newState.values.notifications = this.props.auth.user.notifications;
            this.setState(newState);
        });
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <UserHeader header={"Settings"} subHeader={"Manage your account, notifications, ect"} />
                    </div>
                </div>
                <div className="row">
                    <div class="card" style={{ width: '100%', marginBottom: '1em' }}>
                        <div class="card-body">
                            <h4 class="card-title">Account</h4>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label className="label">Name</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="name" placeholder="Name" value={this.state.values.name} disabled />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label className="label">Email</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="email" placeholder="Email" value={this.state.values.email} disabled />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label className="label">Phone Number #</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="phoneNumber" placeholder="Phone" value={formatPhoneNumber(this.state.values.phoneNumber)} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="card" style={{ width: '100%', marginBottom: '1em' }}>
                        <div class="card-body">
                            <h4 class="card-title">Notifications</h4>
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <label className="label">Receive {this.state.values.notifications.type} notifications?</label>
                            </div>
                            <div className="form-group row">
                                <div className="col-6" style={{ paddingLeft: '0px' }}>
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" className="form-check-input"
                                                name="membershipRadios" id="membershipRadios1" value="Yes"
                                                onClick={() => { this._updateNotifications(true) }}
                                                checked={this.state.values.notifications.recieve} aria-describedby="passwordHelpBlock" />
Yes
<i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                                id="membershipRadios2" value="no" onClick={() => { this._updateNotifications(false) }}
                                                checked={!this.state.values.notifications.recieve} />
No <i className="input-helper"></i>
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="card" style={{ width: '100%', marginBottom: '10em' }}>
                        <div class="card-body">
                            <h4 class="card-title">Password</h4>
                            <a href="/auth/forgot-password" type="button" class="btn btn-primary" style={{fontSize:'1em'}}>Change My Password</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Settings.propTypes = {

};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, { createMessage, fetchUpdateProfile })(Settings);