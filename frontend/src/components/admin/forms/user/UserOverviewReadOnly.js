import React from 'react';
import { formateDate, capitalizeFirstLetter } from '../../../../config/helpers'

export default class UserOverviewReadOnly extends React.Component {
    constructor(props) {
        super(props);
    }
    _getValidationStatusObj = () => {
        let status = this.props.user.auth.status.statusValue;
        let statusStyles = {
            color: "#F0AD4E",
            paddingLeft: '10px'
        }
        if (this.props.user.auth.status.statusValue != "pending") {
            statusStyles.color = "#56B98B";
        }
        return {
            statusStyles,
            status
        }
    }
    render() {
        return (
            <>
                {this.props.user && !this.props.isEdit ?
                    <>
                        <div className="col-lg-4" style={{ marginTop: '10px' }}>
                            <span>Validated:</span><span style={this._getValidationStatusObj().statusStyles}>{capitalizeFirstLetter(this._getValidationStatusObj().status)}</span>
                        </div>
                        <div className="col-lg-8" style={{ marginTop: '10px',paddingLeft:'0px' }}>
                            <span>Date Created:</span><span style={{ paddingLeft: '10px' }}>{formateDate(this.props.user.dateCreated)}</span>
                        </div>
                        <>
                            {this.props.user.guardian && this.props.user.guardian.name?
                                <>
                                    <div className="col-lg-8" style={{ paddingLeft: '0px', marginTop: '10px' }}>
                                        <span>Name</span><span style={{paddingLeft:'10px'}}>{this.props.user.guardian.name.firstName + " " + this.props.user.guardian.name.lastName}</span>
                                    </div>
                                    <div className="col-lg-4" style={{ marginTop: '10px' }}>
                                        <span>Date Created:</span><span style={{ paddingLeft: '10px' }}>{formateDate(this.props.user.dateCreated)}</span>
                                    </div>
                                    <div className="col-lg-8" style={{ paddingLeft: '0px', marginTop: '10px' }}>
                                        <span>Phone Number:</span><span style={{paddingLeft:'10px'}}>{this.props.user.guardian.phoneNumber}</span>
                                    </div>
                                </>
                                :null
                            }
                                
                        </>
                    </>
                    : null
                }
            </>
        );
    }
}