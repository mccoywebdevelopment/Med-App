import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMessage } from '../../../actions/messages';

import QrReader from 'react-qr-reader'
import PopUpCard from '../../../components/user/cards/PopUpCard';
import UserHeader from '../../../components/user/header/UserHeader';

class Settings extends React.Component {
    state = {
        values: {
            isNotifications: false
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
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <UserHeader header={"Settings"} subHeader={"Manage your account, notifications, ect"} />
                    </div>
                </div>
                <div className="row">
                    <div class="card" style={{ width: '100%',marginBottom:'1em' }}>
                        <div class="card-body">
                            <h4 class="card-title">Account</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="card" style={{ width: '100%',marginBottom:'1em' }}>
                        <div class="card-body">
                            <h4 class="card-title">Notifications</h4>
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <label className="label">Recieve Email Notifications?</label>
                            </div>
                            <div className="form-group row">
                                <div className="col-6" style={{ paddingLeft: '0px' }}>
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" className="form-check-input"
                                                name="membershipRadios" id="membershipRadios1" value="Yes"
                                                onClick={() => { this._update("isNotifications", true) }}
                                                checked={this.state.values.isNotifications} aria-describedby="passwordHelpBlock" />
Yes
<i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                                id="membershipRadios2" value="no" onClick={() => { this._update("isNotifications", false) }}
                                                checked={!this.state.values.isNotifications} />
No <i className="input-helper"></i>
                                        </label>
                                    </div>

                                </div>
                            </div>
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

export default connect(mapStateToProps, { createMessage })(Settings);