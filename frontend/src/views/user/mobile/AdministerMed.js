import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {fetchCreateMedEvent} from '../../../actions/event';
import {getRxsMedByID} from '../../../actions/user';
import {getPath} from '../../../config/helpers'
import {togglePopUp} from '../../../actions/popUp';

import PopUpCard from '../../../components/user/cards/PopUpCard';

class AdministerMed extends React.Component {
    state = {
        values: {
            isAway: false,
            notes: "",
        },
        medication:null,
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
    _getBody = ()=> {
        return {
            isAway:this.state.values.isAway,
            notes:this.state.values.notes,
            dateTaken:this.state.values.dateTaken
        }
    }
    _submit = () =>{
        this.props.fetchCreateMedEvent(this._getBody(),this.state.medication._id,true,(res)=>{
            console.log(res);
            this._togglePopUp()
        });
    }
    componentDidMount = () =>{
       let medID = getPath(window,'end');
        this.props.getRxsMedByID(medID,(res)=>{

                let newState = this.state;
                newState.medication = res;
                this.setState(newState);
                console.log(this.state)
            
        });

    }
    _togglePopUp = () =>{
        window.location = "/user/home"
    }
    render() {
        return (
            <>
            {this.state.medication?
             <PopUpCard togglePopUp={this._togglePopUp.bind(this)} header={this.state.medication.name}
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
                    <div className="col-12">
                        <div className="form-group">
                            <label className="label">Notes (optional)</label>
                            <div className="input-group">
                                <textarea type="text" className="form-control" style={{height:'10em'}} name="name" placeholder="Take two..."
                                    value={this.state.values.notes} onChange={(e) => { this._update("notes", e.target.value) }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '0px' }}>
                    <button className="btn btn-success w-100" onClick={() => { this._submit() }}>Submit</button>
                </div>
            </PopUpCard>
            :null}
            </>
        );
    }
}

AdministerMed.propTypes = {
    fetchCreateMedEvent: PropTypes.func.isRequired,
    getRxsMedByID: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired
};

export default connect(null, {fetchCreateMedEvent,togglePopUp,getRxsMedByID})(AdministerMed);