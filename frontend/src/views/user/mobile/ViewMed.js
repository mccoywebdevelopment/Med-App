import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PopUpCard from "../../../components/user/cards/PopUpCard";
import WhenToTake from "../../../components/shared/Misc/WhenToTake";

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
                <PopUpCard togglePopUp={this.props.togglePopUp} header={this.props.data.rxsMedication.name}
                    subHeader={this.props.data.dependent.name.firstName + " " + this.props.data.dependent.name.lastName}>
                    <div className="row" style={{ paddingTop: '0px',marginTop:'0px',paddingBottom:'1em' }}>
                        <div className="col-12" style={{fontSize:'1.25em'}}>
                                <WhenToTake data={this.props.data.rxsMedication.whenToTake}/>
                        </div>
                    </div>
                        
                    <div className="row" style={{ paddingTop: '0px',paddingBottom:'1em' }}>
                        <div className="col-6" style={{fontSize:'1.25em'}}>
                            <span style={{ fontWeight: 'bold' }}>Dosage:</span>
                            <br /><span style={{ fontWeight: 'bold', color: 'rgb(33, 150, 243)' }}>
                                {this.props.data.rxsMedication.dosage.quantity} {this.props.data.rxsMedication.dosage.unit}
                            </span>
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: '0px',paddingBottom:'1em' }}>
                        <div className="col-6" style={{fontSize:'1.25em'}}>
                            <span style={{ fontWeight: 'bold' }}> Date PSCR:</span>
                            <br />{this.props.data.rxsMedication.datePrescribed}
                        </div>
                        <div className="col-6" style={{fontSize:'1.25em'}}>
                            <span style={{ fontWeight: 'bold' }}>End Date:</span><br />{this.props.data.rxsMedication.endDate || '-'}
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: '0px',paddingBottom:'1em' }}>
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
                    {this.state.showMore ?
                        <>
                            <div className="row" style={{ paddingTop: '0px',paddingBottom:'1em' }}>
                                <div className="col-12" >
                                    <span style={{ fontWeight: 'bold' }}>Reason:</span>
                                    <br />{this.props.data.rxsMedication.reason || '-'}
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: '20px',paddingBottom:'1em' }}>
                                <div className="col-12">
                                    <span style={{ fontWeight: 'bold' }}>Intructions:</span><br />{this.props.data.rxsMedication.instructions || '-'}
                                </div>
                            </div>
                        </>
                        : null}
                    <div className="row" style={{ paddingTop: '20px',marginBottom:'0px' }}>
                            <div className="col-12">
                                {this.props.isHistory?
                                    null
                                :
                                <a href={"/user/administer-med/"+this.props.data.rxsMedication._id} className="btn btn-primary" style={{ fontSize: '1.25em', width: '100%', padding: '0.5em' }}>Administer Medication</a>
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