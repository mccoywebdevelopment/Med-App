import React from "react";

export default class RxsMedForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isScroll: true
        }
    }
    componentDidMount = () =>{
        this.setState({isScroll:false});
    }
    render() {
        var scrollTo;
        if (this.state.isScroll) {
            scrollTo = (ref) => {
                if (ref /* + other conditions */) {
                    ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }
        }
        return (
            <>
                <div ref={scrollTo} className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Medication Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="Name"
                                value={this.props.data.values.name} onChange={(e) => { this.props.update(this.props.index, "name", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.name}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Reason</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="Reason"
                                value={this.props.data.values.reason} onChange={(e) => { this.props.update(this.props.index, "reason", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.reason}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Dosage Quantity</label>
                        <div className="input-group">
                            <input type="number" className="form-control" name="name" placeholder="0"
                                value={this.props.data.values.dosageQuantity} onChange={(e) => { this.props.update(this.props.index, "dosageQuantity", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.dosageQuantity}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Dosage Units</label>
                        <div className="input-group">
                            <input type="test" className="form-control" name="name" placeholder="MG"
                                value={this.props.data.values.dosageUnits} onChange={(e) => { this.props.update(this.props.index, "dosageUnits", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.dosageUnits}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Rxs Number</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="Rxs Number"
                                value={this.props.data.values.rxsNumber} onChange={(e) => { this.props.update(this.props.index, "rxsNumber", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.rxsNumber}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Doctor's Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="Doctors Name"
                                value={this.props.data.values.doctorName} onChange={(e) => { this.props.update(this.props.index, "doctorName", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.doctorName}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Doctor's Number</label>
                        <div className="input-group">
                            <input type="tel" className="form-control" name="name" placeholder="000-000-0000" minLength="10" maxLength="10"
                                value={this.props.data.values.doctorPhone} onChange={(e) => { this.props.update(this.props.index, "doctorPhone", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.doctorPhone}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">Date Prescribed</label>
                        <div className="input-group">
                            <input type="date" className="form-control" name="name" placeholder="mm/dd/yyyy"
                                value={this.props.data.values.datePrescribed} onChange={(e) => { this.props.update(this.props.index, "datePrescribed", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.datePrescribed}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">End Date (optional)</label>
                        <div className="input-group">
                            <input type="date" className="form-control" name="name" placeholder="mm/dd/yyyy"
                                value={this.props.data.values.endDate} onChange={(e) => { this.props.update(this.props.index, "endDate", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.endDate}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group">
                        <label className="label">When to Take (optional)</label>
                        <div className="input-group">
                            {/* <input type="date" className="form-control" name="name" placeholder="mm/dd/yyyy"
value={this.props.data.values.endDate} onChange={(e) => { this.props.update(this.props.index, "endDate", e.target.value) }} /> */}
                            <select className="form-control" id="exampleFormControlSelect2" onChange={(e) => { this.props.update(this.props.index, "whenToTake", e.target.value) }}>
                                <option defaultValue="">----Select Any----</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="evening">Evening</option>
                            </select>
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.endDate}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12" style={{ paddingRight: '12.5px', paddingLeft: '12.5px' }}>
                    <div className="form-group">
                        <label className="label">Instructions (optional)</label>
                        <div className="input-group">
                            <textarea type="text" className="form-control" name="name" placeholder="Take two..."
                                value={this.props.data.values.instructions} onChange={(e) => { this.props.update(this.props.index, "instructions", e.target.value) }} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.props.data.errors.instructions}&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}