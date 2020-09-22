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

        let isAdmin = "No";
        let isAdminStyles = {
          color: "inherit",
          paddingLeft: "10px"
        };
        if (this.props.data.values.isAdmin) {
          isAdmin = "Yes";
          isAdminStyles.color = "#8862E0";
        }

        let grouped = "No";
        let groupedStyles = {
          color: 'inherit',
          paddingLeft:'10px'
        }
        if (this.props.isUserSelected && this.props.isUserSelected.guardian && 
            this.props.isUserSelected.guardian.group.length > 0) {
          grouped = "Yes";
          if (this.props.isUserSelected && !this.props.isUserSelected.isAdmin) {
            groupedStyles.color = "#56B98B";
          }
        } else if (this.props.isUserSelected && !this.props.isUserSelected.isAdmin) {
          groupedStyles.color = "red";
        }

        return (
            <>
                {!this.props.isUserSelected || this.props.isEdit?
                    <>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="label">Email</label>
                                <div className="input-group">
                                    {this.props.isUserSelected?
                                    <input type="text" className="form-control" name="nameT" placeholder="Email"
                                        value={this.props.data.values.email} disabled
                                        onChange={(e) => { this.props.update("overview", "email", e.target.value) }} />
                                        :
                                        <input type="text" className="form-control" name="nameT" placeholder="Email"
                                        value={this.props.data.values.email} 
                                        onChange={(e) => { this.props.update("overview", "email", e.target.value) }} />}
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        {this.props.data.errors.email}&nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-2">
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
                        <div className="col-lg-8" style={{paddingLeft:'0px'}}>
                            <span>Email</span><span style={{ paddingLeft: '10px' }}>{this.props.data.values.email}</span>
                        </div>
                        <div className="col-lg-4">
                            <span>Is Admin:</span><span style={isAdminStyles}>{isAdmin}</span>
                        </div>
                        {this.props.data.values.group.value.length > 0 && group ?
                            <>
                                <div className="col-lg-6" style={{marginTop:'10px'}}>
                                    <span>Belongs to Group:</span><span style={groupedStyles}>Yes</span>
                                </div>
                                <div className="col-lg-6" style={{ paddingLeft: '0px', marginTop: '10px' }}>
                                    <span>Group Name:</span><span style={{ paddingLeft: '10px' }}>{group.name}</span>
                                </div>
                                <div className="col-lg-12" style={{ marginTop: '10px' }}>
                                    <span>Group ID:</span><a target="_blank" href={"/admin/groups/" + group._id}>
                                        <span style={{ paddingLeft: '10px' }}>{group._id}</span></a>
                                </div>
                            </>
                            :
                            <div className="col-lg-12" style={{marginTop:'10px',paddingLeft:'0px'}}>
                                <span>Belongs to Group:</span><span style={groupedStyles}>No</span>
                            </div>
                        }
                    </>
                }
                {this.props.children}
            </>
        );
    }
}


