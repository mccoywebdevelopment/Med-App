import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default class TookMed extends React.Component {
    state = {
        values: {
            title: "",
            isAway: false,
            notes: "",
            dateTaken: ""
        },
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
    componentDidMount = () => {
        let newState = this.state;
        newState.title = this.props.title;
        this.setState(newState);
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
                                    {/*this.props.data.errors.dateOfBirth*/}&nbsp;
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

// TookMed.propTypes = {

// };
// const mapStateToProps = (state) => ({
//     guardianState: state.guardianState
// });

// export default connect(mapStateToProps, {})(CreateDependent);