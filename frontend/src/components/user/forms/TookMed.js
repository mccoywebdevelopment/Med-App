import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {fetchCreateMedEvent} from '../../../actions/event';
import {togglePopUp} from '../../../actions/popUp';

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
        alert(this.props.medID);
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
            this.props.fetchCreateMedEvent(this._getBody(),this.props.medID,true);
            this.props.togglePopUp();
        }
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
                    <button className="btn btn-primary" onClick={() => { this._submit() }}>Submit</button>
                </div>
            </>
        );
    }
}

TookMed.propTypes = {
    fetchCreateMedEvent: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired
};
// const mapStateToProps = (state) => ({
//     guardianState: state.guardianState
// });

export default connect(null, {fetchCreateMedEvent,togglePopUp})(TookMed);