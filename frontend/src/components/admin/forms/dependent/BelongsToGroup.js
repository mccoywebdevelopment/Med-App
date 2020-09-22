import React from 'react';

import SearchBox from './SearchBox'

export default class BelongsToGroup extends React.Component {
    constructor(props){
        super(props);
    }
    _setGroupInput = (value,select,id) =>{
        id = id || "";
        this.props.update(this.props.form,"value",id);
    }
    _getSearchBoxData = () => {
        let data = [];
        for (var i = 0; i < this.props.groups.length; ++i) {
            data.push({ key: this.props.groups[i]._id, value: this.props.groups[i].name });
        }
        return data;
    }
    render() {
        let placeholderValue = "Enter Group Name";
        if(this.props.data.value.length>0){
            for(var i=0;i<this.props.groups.length;++i){
                if(this.props.groups[i]._id == this.props.data.value){
                    placeholderValue = this.props.groups[i].name;
                }
            }
        }
        return (
            <>
                <div className="col-lg-6">
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Belongs to Group</label>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-6" style={{ paddingLeft: '0px' }}>
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
                        <div className="col-sm-6">
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
                <div className={"col-lg-4 my-search-box offset-lg-2 " + 
                    (!this.props.data.isYes? 'my-hidden ' : '') +
                    (this.props.data.value.length>0? 'my-search-box-selected ' : '')}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Group Name</label>
                    </div>
                    <SearchBox _setGroupInput={this._setGroupInput} data={this._getSearchBoxData()} 
                        placeholder={placeholderValue} defaultValue="test"/>
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {this.props.error}&nbsp;
                    </div>
                </div>
            </>
        );
    }
}


