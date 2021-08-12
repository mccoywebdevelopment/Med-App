import React from 'react';
import { getAge, formateDate, convertToDateInput} from '../../../../config/helpers'

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
        let group = this._getGroup(this.props.data.values.group);
        return (
            <>
                {!this.props.isDepSelected || this.props.data.isEdit?
                <>
                    <div className="col-lg-6">
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
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Date of Birth</label>
                            <div className="input-group">
                                <input type="date" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                    value={convertToDateInput(this.props.data.values.dateOfBirth)} 
                                    onChange={(e)=>{this.props.update("overview","dateOfBirth",e.target.value)}} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.props.data.errors.dateOfBirth}&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                            <label className="label">Date of Placement (optional)</label>
                            <div className="input-group">
                                <input type="date" className="form-control" name="dateOfPlacement" placeholder="mm/dd/yyyy"
                                    value={convertToDateInput(this.props.data.values.dateOfPlacement)} 
                                    onChange={(e)=>{this.props.update("overview","dateOfPlacement",e.target.value)}} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {this.props.data.errors.dateOfPlacement}&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="col-lg-6">
                        <span>Name:</span><span style={{paddingLeft:'10px'}}>{this.props.data.values.name}</span>
                    </div>
                    <div className="col-lg-6">
                        <span>Age:</span><span style={{paddingLeft:'10px'}}>{getAge(this.props.data.values.dateOfBirth)}</span>
                    </div>
                    {this.props.data.values.group.length>0 && group?
                        <>
                            <div className="col-lg-6" style={{marginTop:'10px'}}>
                                <span>Active:</span><span style={{paddingLeft:'10px',color:'#19d895'}}>Yes</span>
                            </div>
                            <div className="col-lg-6" style={{marginTop:'10px'}}>
                                <span>Group Name:</span><a target="_blank" href={"/admin/groups/"+group._id}><span style={{paddingLeft:'10px'}}>{group.name}</span></a>
                            </div>
                        </>
                        :!this.props.isUser?
                        <div className="col-lg-6" style={{marginTop:'10px'}}>
                            <span>Active:</span><span style={{color:'red',paddingLeft:'10px'}}>No</span>
                        </div>
                        :null
                    }
                    <div className="col-lg-6" style={{marginTop:'10px'}}>
                        <span>Date Created:</span><span style={{paddingLeft:'10px'}}>
                            {formateDate(this.props.isDepSelected.dateCreated)}
                        </span>
                    </div>
                    <div className="col-lg-6" style={{marginTop:'10px'}}>
                        <span>Date of Placement:</span><span style={{paddingLeft:'10px'}}>{formateDate(this.props.data.values.dateOfPlacement) || "-"}</span>
                    </div>
                </>
                }
                {this.props.children}
            </>
        );
    }
}


