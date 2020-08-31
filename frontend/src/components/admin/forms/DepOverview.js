import React from 'react';
import { getAge, formateDate} from '../../../config/helpers'

export default class DepOverview extends React.Component {
    constructor(props){
        super(props);
    }
    _getGroup = (groupValue) =>{
        for(var i=0;i<this.props.groups.length;++i){
            if(groupValue == this.props.groups[i]._id){
                return this.props.groups[i];
            }
        }
        return null;
    }
    render() {
        let group = this._getGroup(this.props.data.values.group.value);
        return (
            <>
                {!this.props.isDepSelected || this.props.data.isEdit?
                <>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label className="label">Name</label>
                            <div className="input-group">
                                <input type="text" className="form-control" name="name" placeholder="First & Last Name"
                                    value={this.props.data.values.name} 
                                    onChange={(e)=>{this.props.update("overview","name",e.target.value)}} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.props.data.errors.name}&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form-group">
                            <label className="label">Date of Bith</label>
                            <div className="input-group">
                                <input type="date" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                    value={this.props.data.values.dateOfBirth} 
                                    onChange={(e)=>{this.props.update("overview","dateOfBirth",e.target.value)}} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.props.data.errors.dateOfBirth}&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="col-lg-5" style={{paddingLeft:'0px'}}>
                        <span>Name:</span><span style={{paddingLeft:'10px'}}>{this.props.data.values.name}</span>
                    </div>
                    <div className="col-lg-3">
                        <span>Age:</span><span style={{paddingLeft:'10px'}}>{getAge(this.props.data.values.dateOfBirth)}</span>
                    </div>
                    {this.props.data.values.group.value.length>0 && group?
                        <>
                            <div className="col-lg-4">
                                <span>Belongs to Group:</span><span style={{paddingLeft:'10px',color:'#19d895'}}>Yes</span>
                            </div>
                            <div className="col-lg-5" style={{paddingLeft:'0px',marginTop:'10px'}}>
                                <span>Group Name:</span><span style={{paddingLeft:'10px'}}>{group.name}</span>
                            </div>
                            <div className="col-lg-7" style={{marginTop:'10px'}}>
                                <span>Group ID:</span><a target="_blank" href={"/admin/groups/"+group._id}>
                                <span style={{paddingLeft:'10px'}}>{group._id}</span></a>
                            </div>
                        </>
                        :
                        <div className="col-lg-4">
                            <span>Belongs to Group:</span><span style={{paddingLeft:'10px',color:'red'}}>No</span>
                        </div>
                    }
                    <div className="col-lg-12" style={{marginTop:'10px'}}>
                        <span>Date Created:</span><span style={{paddingLeft:'10px'}}>
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


