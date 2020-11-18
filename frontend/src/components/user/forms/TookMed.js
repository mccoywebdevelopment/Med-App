import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {fetchCreateMedEvent,fetchUpdateMedEvent} from '../../../actions/event';
import {togglePopUp} from '../../../actions/popUp';

import RxsMedDates from "../../shared/tables/RxsMedDates";

class TookMed extends React.Component {
    state = {
        values: {
            isAway: false,
            notes: "",
            dateTaken: ""
        },
        errors:{
            dateTaken:""
        },
        body: null
    }
    constructor(props) {
        super(props);
        // alert(JSON.stringify(props));
    }
    _isValid = () =>{
        let newState = this.state;
        let valid = true;;
        if(this.state.values.dateTaken.length<1){
            newState.errors.dateTaken = "This field is required";
            valid = false;
        }else{
            newState.errors.dateTaken = "";
        }
        this.setState(newState);
        if(!valid){
            alert("Please fix the errors below:");
        }
        return valid;
    }
    _update = (key, value) => {
        let newState = this.state;
        newState.values[key] = value;
        this.setState(newState);
    }
    _getBody = ()=> {
        return {
            isAway:this.state.values.isAway,
            notes:this.state.values.notes,
            dateTaken:this.state.values.dateTaken
        }
    }
    _submit = () =>{
        if(this._isValid()){
            if(this.props.isEdit){
                this.props.fetchUpdateMedEvent(this._getBody(),this.props.eventID,true,(res)=>{
                    this._back(true);
                });
            }else{
                this.props.fetchCreateMedEvent(this._getBody(),this.props.medID,true,(res)=>{
                    this._back(true);
                });
            }
            this.props.togglePopUp();
        }
    }
    _back = (disableWindow) =>{
        if(!disableWindow && window.confirm("Are you sure you want to go back all changes made will not be saved.")){
            this.props.togglePopUp(this.props.medName, <RxsMedDates rxsMedID={this.props.medID} />);
        }else if(disableWindow){
            this.props.togglePopUp(this.props.medName, <RxsMedDates rxsMedID={this.props.medID} />);
        }
    }
    _formateDateIsEdit = (date) =>{
        let dates = date.split('/');
        let yyyy = dates[2];
        let mm = dates[0];
        let dd = dates[1];
        return(yyyy + "-" + mm + "-" + dd);
    }
    _isUpdated = () =>{
        if(JSON.stringify(this.state.values) != JSON.stringify(this.state.oldValues)){
            return true;
        }else{
            return false;
        }
    }
    componentDidMount = () =>{
        if(this.props.isEdit){
            let newState = this.state;
            newState.values.isAway = this.props.isEdit.isAway;
            newState.values.dateTaken = this._formateDateIsEdit(this.props.isEdit.dateTaken);
            newState.values.notes = this.props.isEdit.notes;
            newState.oldValues = JSON.parse(JSON.stringify(newState.values));
            this.setState(newState);
        }
        // alert(JSON.stringify(this.state));
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Date Taken</label>
                            <div className="input-group">
                                <input type="date" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                    value={this.state.values.dateTaken}
                                    onChange={(e) => { this._update("dateTaken", e.target.value) }} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.state.errors.dateTaken}&nbsp;
</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group" style={{ marginBottom: '0px' }}>
                            <label className="label">Is away?</label>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6" style={{ paddingLeft: '0px' }}>
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
                            <div className="col-sm-6">
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
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Notes (optional)</label>
                            <div className="input-group">
                                <textarea type="text" className="form-control" name="name" placeholder="Take two..."
                                    value={this.state.values.notes} onChange={(e) => { this._update("notes", e.target.value) }} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {/*this.props.data.errors.instructions*/}&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <>
                    {this.props.isEdit?
                        <button className="btn btn-primary" style={{marginRight:'30px'}} onClick={() => { this._back() }}>Back</button>
                    :<button className="btn btn-primary" onClick={() => { this._submit() }}>Submit</button>}
                    {this.props.isEdit && this._isUpdated()?
                        <button className="btn btn-primary" onClick={() => { this._submit() }}>Update</button>
                        :null
                    }
                    </>
                </div>
            </>
        );
    }
}

TookMed.propTypes = {
    fetchCreateMedEvent: PropTypes.func.isRequired,
    fetchUpdateMedEvent: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired
};
// const mapStateToProps = (state) => ({
//     guardianState: state.guardianState
// });

export default connect(null, {fetchCreateMedEvent,togglePopUp,fetchUpdateMedEvent})(TookMed);