import React from 'react';

import SearchBox from './SearchBox'

export default class BelongsToGroup extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    _setGroupInput = (value,select,id) =>{
        id = id || "";
        this.props.update(this.props.form,"value",id);
    }
    _getSearchBoxData = () => {
        let data = [];
        for (var i = 0; i < this.props.groups.all.length; ++i) {
            data.push({ key: this.props.groups.all[i]._id, value: this.props.groups.all[i].name });
        }
        return data;
    }
    render() {
        return (
            <>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Belongs to Group</label>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4" style={{ paddingLeft: '0px' }}>
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input"
                                        name="membershipRadios" id="membershipRadios1" value="Yes"
                                        onClick={() => { this.props.toggle() }}
                                        checked={this.props.data.isYes} aria-describedby="passwordHelpBlock" />
                                        Yes
                                        <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                        id="membershipRadios2" value="no" onClick={() => { this.props.toggle() }}
                                        checked={!this.props.data.isYes} />
                                        No <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-lg-4 my-search-box " + (!this.props.data.isYes? 'my-hidden' : '')}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Group Name</label>
                    </div>
                    <SearchBox _setGroupInput={this._setGroupInput} data={this._getSearchBoxData()} placeholder={"Enter Group Name"} />
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {this.props.error}&nbsp;
                    </div>
                </div>
            </>
        );
    }
}


