import React from 'react';
import { getAge, formateDate } from '../../../../config/helpers'

export default class UserOverview extends React.Component {

    constructor(props) {
        super(props);
    }
    _getGroup = (groupValue) => {
        for (var i = 0; i < this.props.groups.length; ++i) {
            if (groupValue == this.props.groups[i]._id) {
                return this.props.groups[i];
            }
        }
        return null;
    }
    render() {
        let group = this._getGroup(this.props.data.values.group.value);
        return (
            <>
                {!this.props.isDepSelected || this.props.data.isEdit ?
                    <>
                        <div className="col-lg-4">
                            <div className="form-group">
                                <label className="label">Email</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="nameT" placeholder="Email"
                                        value={this.props.data.values.name}
                                        onChange={(e) => { this.props.update("overview", "email", e.target.value) }} />
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        {this.props.data.errors.email}&nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <label className="label">Is Admin</label>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-6" style={{ paddingLeft: '0px' }}>
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" className="form-check-input"
                                                id="isAdminYes"
                                                onClick={() => { this.props.update("overview", "isAdmin", true) }}
                                                checked={this.props.data.values.isAdmin} aria-describedby="passwordHelpBlock" />
                                                Yes
                                                <i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-radio">
                                        <label className="form-check-label">
                                            <input readOnly={true} type="radio" 
                                                className="form-check-input" id="isAdminFalse" 
                                                onClick={() => { this.props.update("overview", "isAdmin",false) }}
                                                checked={!this.props.data.values.isAdmin} />
                                                No <i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-lg-5" style={{ paddingLeft: '0px' }}>
                            <span>Name:</span><span style={{ paddingLeft: '10px' }}>{this.props.data.values.name}</span>
                        </div>
                        <div className="col-lg-3">
                            <span>Age:</span><span style={{ paddingLeft: '10px' }}>{getAge(this.props.data.values.dateOfBirth)}</span>
                        </div>
                        {this.props.data.values.group.value.length > 0 && group ?
                            <>
                                <div className="col-lg-4">
                                    <span>Belongs to Group:</span><span style={{ paddingLeft: '10px', color: '#19d895' }}>Yes</span>
                                </div>
                                <div className="col-lg-5" style={{ paddingLeft: '0px', marginTop: '10px' }}>
                                    <span>Group Name:</span><span style={{ paddingLeft: '10px' }}>{group.name}</span>
                                </div>
                                <div className="col-lg-7" style={{ marginTop: '10px' }}>
                                    <span>Group ID:</span><a target="_blank" href={"/admin/groups/" + group._id}>
                                        <span style={{ paddingLeft: '10px' }}>{group._id}</span></a>
                                </div>
                            </>
                            :
                            <div className="col-lg-4">
                                <span>Belongs to Group:</span><span style={{ paddingLeft: '10px', color: 'red' }}>No</span>
                            </div>
                        }
                        <div className="col-lg-12" style={{ marginTop: '10px' }}>
                            <span>Date Created:</span><span style={{ paddingLeft: '10px' }}>
                                {formateDate(this.props.isDepSelected.dateCreated)}
                            </span>
                        </div>
                    </>
                }
                {this.props.children}
            </>
        );
    }
}


