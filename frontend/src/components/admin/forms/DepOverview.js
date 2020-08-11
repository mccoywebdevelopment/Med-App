import React from 'react';

import BelongsToGroup from './BelongsToGroup';

export default class DepOverview extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="First & Last Name"
                                value={this.props.data.values.name} onChange={(e)=>{this.props.update("overview","name",e.target.value)}} />
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
                                value={this.props.data.dateOfBirth} onChange={(e)=>{this.props.update("overview","dateOfBirth",e.target.value)}} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.dateOfBirth}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.children}
            </>
        );
    }
}


