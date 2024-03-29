import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";
import {fetchNotifications } from "../../actions/notifications";
import { togglePopUp } from '../../actions/popUp';
import { fetchPopulatedDependents, fetchDeleteDependent } from "../../actions/dependent";
import { changeColor } from "../../actions/theme";
import { fetchQRData } from "../../actions/data";

import DependentTable from "../../components/admin/tables/DependentTable";
import Overview from "../../components/admin/Overview/Overview";
import CreateDependent from "../../components/admin/forms/dependent/CreateDependent";
import ExportDataForm from "../../components/admin/forms/exportData/ExportDataForm";

class DependentView extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        dependentState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    state = {
        filterBy: {
            all: false,
            grouped: true,
            notGrouped: false
        }
    }
    constructor(props) {
        super(props);
        this._deleteDependent = this._deleteDependent.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
    }
    _toggleFilterBy = (all, grouped, notGrouped) => {
        let newState = this.state;

        if (all) {
            newState.filterBy.all = true;
            newState.filterBy.grouped = false;
            newState.filterBy.notGrouped = false;
        } else if (grouped) {
            newState.filterBy.all = false;
            newState.filterBy.grouped = true;
            newState.filterBy.notGrouped = false;
        } else {
            newState.filterBy.all = false;
            newState.filterBy.grouped = false;
            newState.filterBy.notGrouped = true;
        }

        this.setState(newState);
    }
    _getTotalNumberOfDependents = () => {
        return this.props.dependentState.data.length;
    }
    _toggleRedirect = (dep) => {
        let newState = this.state;
        window.location = "/admin/dependents/" + dep._id
        this.setState(newState);
    }
    _getAverageAge = () => {
        if (this.props.dependentState.data.length < 1) {
            return 0;
        }
        let age = 0;
        for (var i = 0; i < this.props.dependentState.data.length; ++i) {
            let birthday = +new Date(this.props.dependentState.data[i].dateOfBirth);
            age = age + ~~((Date.now() - birthday) / (31557600000));
        }
        return age / this.props.dependentState.data.length;
    }
    _getAverageMeds = () => {
        let meds = 0;
        if (this.props.dependentState.data.length < 1) {
            return 0;
        }
        for (var i = 0; i < this.props.dependentState.data.length; ++i) {
            if(this.props.dependentState.data[i].rxsMedications){
                meds = meds + this.props.dependentState.data[i].rxsMedications.length;
            }
        }
        return (meds / this.props.dependentState.data.length);
    }
    _deleteDependent = (dep) => {
        if (window.confirm("Are you sure you want to delete " + dep.name.firstName + " profile and all their data?")) {
            this.props.fetchDeleteDependent(dep._id);
        }
    }

    _toggleExportData = () => {
        this.props.togglePopUp("Export Data", <ExportDataForm />);
    }
    _toggleQRData = () => {
        this.props.fetchQRData();
    }
    _getData = () => {
        if (this.state.filterBy.all) {
            return this.props.dependentState.data;
        } else if (this.state.filterBy.grouped) {
            return this._filterByGroup(true);
        } else {
            return this._filterByGroup(false);
        }
    }
    _filterByGroup = (isGroup) => {
        let data = [];
        for (var i = 0; i < this.props.dependentState.data.length; ++i) {
            if (isGroup && this.props.dependentState.data[i].group.length > 0) {
                data.push(this.props.dependentState.data[i]);
            } else if (!isGroup && this.props.dependentState.data[i].group.length < 1) {
                data.push(this.props.dependentState.data[i]);
            }
        }
        return data;
    }
    componentDidMount = () => {
        this.props.changeColor("#2196f3");
        this.props.fetchPopulatedDependents(() => { });
        this.props.fetchNotifications(false);
    }
    render() {
        let isGroupLength = this._filterByGroup(true).length;
        let notGroupLength = this._filterByGroup(false).length;
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12">
                                <h4 className="view-header">Dependents</h4>
                            </div>
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <Overview dependentsLength={this._getData().length} averageMed={this._getAverageMeds()}
                                    averageAge={this._getAverageAge()} />
                            </div>
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <button type="button"
                                    onClick={() => { this.props.togglePopUp("Create Dependent", <CreateDependent />, "90%") }}
                                    className="btn btn-primary btn-fw" style={{fontSize:'0.8em'}}>Create</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button onClick={() => { this._toggleFilterBy(true) }} type="button"
                                        className={"btn " + (this.state.filterBy.all ? "btn-primary" : "btn-outline-secondary") } style={{fontSize:'0.8em'}}>All</button>
                                    <button onClick={() => { this._toggleFilterBy(false, true) }} type="button"
                                        className={"btn " + (this.state.filterBy.grouped ? "btn-primary" : "btn-outline-secondary")} style={{fontSize:'0.8em'}}>Active ({isGroupLength})</button>
                                    <button onClick={() => { this._toggleFilterBy(false, false, true) }} type="button"
                                        className={"btn " + (this.state.filterBy.notGrouped ? "btn-primary" : "btn-outline-secondary")} style={{fontSize:'0.8em'}}>Inactive ({notGroupLength})</button>
                                </div>
                                {this._getData().length > 0 ?
                                    <div class="dropdown" style={{float:'right'}}>
                                    <button class="btn btn-outline-primary dropdown-toggle hover-white" style={{fontSize:'0.8em'}} type="button" id="dropdownMenuOutlineButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-download" style={{paddingRight:'5px'}}></i>Export
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuOutlineButton1">
                                      <a class="dropdown-item"onClick={()=>{this._toggleExportData()}} style={{color:'#2196f3',cursor:'pointer'}}>Excel</a>
                                      <a class="dropdown-item"onClick={()=>{this._toggleQRData()}} style={{color:'#2196f3',cursor:'pointer'}}>QR</a>
                                    </div>
                                  </div>
                                    // <button onClick={()=>{this._toggleExportData()}} style={{float:'right'}}type="button" className="btn btn-outline-primary btn-fw hover-white">
                                    // <i className="fas fa-download"></i>Export</button>
                                    : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this._getData().length > 0 ?
                                    <DependentTable dependents={this._getData()} delete={this._deleteDependent}
                                        changeDepSel={this._toggleRedirect} />
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
DependentView.propTypes = {
    fetchLogin: PropTypes.func.isRequired,
    fetchPopulatedDependents: PropTypes.func.isRequired,
    fetchDeleteDependent: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    fetchQRData: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
    groupState: state.groupState
});

export default connect(mapStateToProps, {
    fetchLogin, changeColor, fetchDeleteDependent, fetchQRData,togglePopUp,
    fetchPopulatedDependents, fetchNotifications
})(DependentView);