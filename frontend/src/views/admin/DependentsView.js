import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";
import { togglePopUp } from '../../actions/popUp';
import { fetchPopulatedDependents, fetchDeleteDependent } from "../../actions/dependent";
import { changeColor } from "../../actions/theme";

import DependentTable from "../../components/admin/tables/DependentTable";
import Overview from "../../components/admin/Overview/Overview";
import CreateDependent from "../../components/admin/forms/dependent/CreateDependent";

class DependentView extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        dependentState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._deleteDependent = this._deleteDependent.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
    }
    _getTotalNumberOfDependents = () =>{
        return this.props.dependentState.data.length;
    }
    _toggleRedirect = (dep) =>{
        let newState = this.state;
        window.location = "/admin/dependents/" + dep._id
        this.setState(newState);
    }
    _getAverageAge = () =>{
        if(this.props.dependentState.data.length<1){
            return 0;
        }
        let age = 0;
        for(var i=0;i<this.props.dependentState.data.length;++i){
            let birthday = +new Date(this.props.dependentState.data[i].dateOfBirth);
            age = age + ~~((Date.now() - birthday) / (31557600000));
        }
        return age/this.props.dependentState.data.length;
    }
    _getAverageMeds = () =>{
        let meds = 0;
        if(this.props.dependentState.data.length<1){
            return 0;
        }
        for(var i=0;i<this.props.dependentState.data.length;++i){
            for(var ix=0;ix<this.props.dependentState.data[i].rxs.length;++ix){
                meds = meds + this.props.dependentState.data[i].rxs[ix].rxsMedications.length;
            }
        }
        return (meds/this.props.dependentState.data.length);
    }
    _deleteDependent = (dep) =>{
        if(window.confirm("Are you sure you want to delete "+dep.name.firstName+" profile and all their data?")){
            this.props.fetchDeleteDependent(dep._id);
        }
    }
    componentDidMount = () =>{
        this.props.changeColor("#2196f3");
        this.props.fetchPopulatedDependents(()=>{});
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Dependents</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <Overview dependentsLength={this._getTotalNumberOfDependents()} averageMed={this._getAverageMeds()} 
                                        averageAge={this._getAverageAge()}/>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <button type="button" 
                                    onClick={()=>{this.props.togglePopUp("Create Dependent",<CreateDependent/>,"90%")}} 
                                    className="btn btn-primary btn-fw">Create</button>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.dependentState.data.length>0?
                                <DependentTable dependents={this.props.dependentState.data} delete={this._deleteDependent} 
                                    changeDepSel={this._toggleRedirect}/>
                                :null}
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
    changeColor: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
    groupState: state.groupState
});

export default connect(mapStateToProps, { fetchLogin, changeColor, fetchDeleteDependent, togglePopUp, 
    fetchPopulatedDependents})(DependentView);