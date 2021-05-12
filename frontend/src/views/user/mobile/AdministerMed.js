import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCreateMedEvent, fetchCreateMedEventRefID } from '../../../actions/event';
import { createMessage } from '../../../actions/messages';
import { getRxsMedByID, getRxsMedByRefID } from '../../../actions/user';
import { getPath, getPaths } from '../../../config/helpers'
import { togglePopUp } from '../../../actions/popUp';

import PopUpCard from '../../../components/user/cards/PopUpCard';

import failImage from "../../../assets/images/user/fail_feedback.svg"
import successImage from "../../../assets/images/user/success_feedback.svg"

class AdministerMed extends React.Component {
    state = {
        values: {
            isAway: false,
            notes: "",
            guardian: ""
        },
        showFeedBackValid:false,
        showGuardians: false,
        isValid: false,
        medication: null,
        guardians: [],
        body: null
    }
    constructor(props) {
        super(props);
    }
    _update = (key, value) => {
        let newState = this.state;
        newState.values[key] = value;
        this.setState(newState);
    }
    _getBody = () => {
        return {
            isAway: this.state.values.isAway,
            notes: this.state.values.notes,
            dateTaken: this.state.values.dateTaken
        }
    }
    _isActive = (activeMeds, medID) => {
        for (var i = 0; i < activeMeds.length; ++i) {
            if (activeMeds[i].rxsMedication._id == medID) {
                return true;
            }
        }
        return false;
    }
    _submitNonLocalRefID = () =>{
        let length = getPaths(window).length;
        let refID = getPath(window, length - 1);
        if(this.state.values.guardian.length<1){
            this.props.createMessage('Guardian field is required.','danger',12000);
        }else{
            let body = {
                ...this._getBody(),
                guardianID:this.state.values.guardian
            }
    
            this.props.fetchCreateMedEventRefID(body, refID, true, (res) => {
                let newState = this.state;
                newState.showFeedBackValid = true;
                this.setState(newState);
            });
        }
    }
    _submitLocal = () =>{
        this.props.fetchCreateMedEvent(this._getBody(), this.state.medication._id, true, (res) => {
            this._togglePopUp()
        });
    }
    _submitLocalRefID = () =>{
        let length = getPaths(window).length;
        let refID = getPath(window, length - 2);
        let body = {
            ...this._getBody(),
            guardianID:this.props.auth.user.guardianID
        }

        this.props.fetchCreateMedEventRefID(body, refID, true, (res) => {
            this._togglePopUp()
        });
    }
    _submit = () => {
        if(this.props.isRefID && this.props.isLocal){
            this._submitLocalRefID();
        }else if(this.props.isRefID){
            this._submitNonLocalRefID();
        }else{
            this._submitLocal();
        }
    }
    componentDidMount = () => {

        let length = getPaths(window).length;
        if (this.props.isLocal && this.props.isRefID) {
            let refID = getPath(window, length - 2);
            this.props.getRxsMedByRefID(refID, (res) => {
                let newState = this.state;
                newState.medication = res.rxsMedication;
                this.setState(newState);
            });
        } else if (this.props.isLocal) {
            let medID = getPath(window, length - 2);
            this.props.getRxsMedByID(medID, (res) => {
                let newState = this.state;
                newState.medication = res;
                this.setState(newState);
            });
        } else {
            //is refID and is not local therefore show guardians forget login
            let refID = getPath(window, length - 1);
            this.props.getRxsMedByRefID(refID, (res) => {
                let newState = this.state;
                newState.showGuardians = true;
                newState.medication = res.rxsMedication;
                newState.guardians = res.groups[0].guardians;
                if (res.groups.length > 1) {
                    alert("ERROR: somehow there is a dep that is in two or more groups.")
                }
                this.setState(newState);
            });
        }
    }
    _togglePopUp = () => {
        window.location = "/user/home"
    }
    render() {
        const guardianList = () =>{
            return this.state.guardians.map((guardian,index)=>{
                return(
                <option id={"guardianList"+indexedDB} value={guardian._id}>{guardian.name.firstName + " "+ guardian.name.lastName}</option>
                )
            });
        }
        return (
            <>
                {this.state.medication && !this.state.showFeedBackValid?
                    <PopUpCard togglePopUp={!this.props.isLocal || this._togglePopUp.bind(this)} header={this.state.medication.name}
                        subHeader={"Administer Medication"}>
                        <div className="row h-100">
                            <div className="col-12">
                                <div className="form-group" style={{ marginBottom: '0px' }}>
                                    <label className="label">Is away?</label>
                                </div>
                                <div className="form-group row">
                                    <div className="col-6" style={{ paddingLeft: '0px' }}>
                                        <div className="form-radio">
                                            <label className="form-check-label">
                                                <input readOnly={true} type="radio" className="form-check-input"
                                                    name="membershipRadios" id="membershipRadios1" value="Yes"
                                                    onClick={() => { this._update("isAway", true) }}
                                                    checked={this.state.values.isAway} aria-describedby="passwordHelpBlock" />
                                                    Yes
                                                    <i className="input-helper"></i>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-radio">
                                            <label className="form-check-label">
                                                <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                                    id="membershipRadios2" value="no" onClick={() => { this._update("isAway", false) }}
                                                    checked={!this.state.values.isAway} />
                                                     No <i className="input-helper"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.showGuardians && this.state.guardians.length>0?
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="label">Guardian</label>
                                    <div className="input-group">
                                        <select class="form-control form-control-lg" id="exampleFormControlSelect1" value={this.state.values.guardian} onChange={(e) => { this._update("guardian", e.target.value) }}>
                                            <option value=""></option>
                                            {guardianList()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            :null}
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="label">Notes (optional)</label>
                                    <div className="input-group">
                                        <textarea type="text" className="form-control" style={{ height: '10em' }} name="name" placeholder="Take two..."
                                            value={this.state.values.notes} onChange={(e) => { this._update("notes", e.target.value) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '30px', marginBottom: '0px' }}>
                            <button className="btn btn-success w-100" onClick={() => { this._submit() }}>Submit</button>
                        </div>
                    </PopUpCard>
                    :this.state.showFeedBackValid?
                    <div style={{paddingTop:'5em',textAlign:'center'}}>
                        <span style={{fontSize:'1.25em'}}>You have successfully logged a medication</span>
                        <img src={successImage} className="img-fluid" style={{marginTop:'3em'}}/>
                    </div>
                    : 
                    <div style={{paddingTop:'5em',textAlign:'center'}}>
                        <span style={{fontSize:'1.25em'}}>User does not have access to log this med at this time</span>
                        <img src={failImage} className="img-fluid" style={{marginTop:'3em'}}/>
                    </div>
                    }
            </>
        );
    }
}
AdministerMed.propTypes = {
    auth: PropTypes.object.isRequired,
    dependentState: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});


export default connect(mapStateToProps, { fetchCreateMedEvent, togglePopUp, getRxsMedByID, getRxsMedByRefID, fetchCreateMedEventRefID,createMessage })(AdministerMed);