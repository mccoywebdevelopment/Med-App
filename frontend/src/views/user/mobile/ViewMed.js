import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PopUpCard from "../../../components/user/cards/PopUpCard";

class ViewMed extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        showMore: false,
    }
    _toggle = () => {
        let newState = this.state;
        newState.showMore = !newState.showMore;
        this.setState(newState);
    }
    render() {
        return (
            <>
                <PopUpCard togglePopUp={this.props.togglePopUp} header={this.props.data.name} subHeader={this.props.dependent.name.firstName + " " + this.props.dependent.name.lastName}>
                <div className="row" style={{ paddingTop: '0px' }}>
                    <div className="col-6">
                        <span style={{ fontWeight: 'bold' }}>Dosage:</span>
                        <br /><span style={{ fontWeight: 'bold', color: 'rgb(33, 150, 243)' }}>{this.props.data.dosage.quantity} {this.props.data.dosage.units}</span>
                    </div>
                </div>
                <div className="row" style={{ paddingTop: '20px' }}>
                    <div className="col-6">
                        <span style={{ fontWeight: 'bold' }}> Date PSCR:</span>
                        <br />{this.props.data.datePrescribed}
                    </div>
                    <div className="col-6">
                        <span style={{ fontWeight: 'bold' }}>End Date:</span><br />{this.props.data.endDate || '-'}
                    </div>
                </div>
                <div className="row" style={{ paddingTop: '20px' }}>
                    <div className="col-12">
                        <button className="btn btn-success" style={{ fontSize: '1.25em', width: '100%', padding: '0.5em' }}>Administer Medication</button>
                    </div>
                </div>
                {this.state.showMore ?
                    <>
                        <div className="row" style={{ paddingTop: '10px' }}>
                            <div className="col-12">
                                <span style={{ fontWeight: 'bold' }}>Reason:</span>
                                <br />{this.props.data.reason || '-'}
                            </div>
                        </div>
                        <div className="row" style={{ paddingTop: '20px' }}>
                            <div className="col-12">
                                <span style={{ fontWeight: 'bold' }}>Intructions:</span><br />{this.props.data.instructions || '-'}
                            </div>
                        </div>
                    </>
                    : null}
                <div className="row" style={{ paddingTop: '10px' }}>
                    <div className="col-12">
                        {!this.state.showMore ?
                            <p onClick={this._toggle} title="view rest of med" style={{
                                color: 'rgb(33, 150, 243)', fontWeight: 'bold',
                                cursor: 'pointer', fontSize: '1em'
                            }}>View More Details&nbsp;</p>
                            :
                            <p onClick={this._toggle} title="view rest of med" style={{
                                color: 'rgb(33, 150, 243)', fontWeight: 'bold',
                                cursor: 'pointer', fontSize: '1em'
                            }}>Show Less Details&nbsp;</p>
                        }
                    </div>
                </div>
                </PopUpCard>
            </>
        );
    }
}
ViewMed.propTypes = {
    auth: PropTypes.object.isRequired,
    dependentState: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, {})(ViewMed);