import React from 'react';

export default class GroupOverview extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                {!this.props.isUserSelected || this.props.isEdit?
                    <>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="label">Name</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="nameT" placeholder="Name"
                                        value={this.props.data.values.email} onChange={(e) => { this.props.update("overview", "name", e.target.value) }} />
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        {this.props.data.errors.name}&nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-lg-6">
                            <span>Name:</span><span style={{ paddingLeft: '5px' }}>{this.props.data.values.name}</span>
                        </div>
                    </>
                }
                {this.props.children}
            </>
        );
    }
}


