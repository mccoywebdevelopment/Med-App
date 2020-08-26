import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";
import { togglePopUp } from '../../actions/popUp';
import { fetchPopulatedDependents, fetchDeleteDependent } from "../../actions/dependent";
import { Redirect } from 'react-router-dom';

import DependentTable from "../../components/admin/tables/DependentTable";
import Overview from "../../components/admin/Overview/Overview";
import CreateDependent from "../../components/admin/forms/CreateDependent";

//Make this component redirect to overview
//overiew just dispatches the store.state to update dependent
//use window location to update url that way it doesn't have to rerender the overview!!!!!
class DependentView extends React.Component {
    /*
    Height for the table when user selects Dependent will be the max height of the 
    ViewDependent.
    */
   state = {
       isOverview:null
   }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        dependents: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._deleteDependent = this._deleteDependent.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
    }
    _getTotalNumberOfDependents = () =>{
        return this.props.dependents.length;
    }
    _toggleRedirect = (dep) =>{
        let newState = this.state;
        newState.isOverview = dep;
        this.setState(newState);
        console.log(this.state);
    }
    _getAverageAge = () =>{
        if(this.props.dependents.length<1){
            return 0;
        }
        let age = 0;
        for(var i=0;i<this.props.dependents.length;++i){
            let birthday = +new Date(this.props.dependents[i].dateOfBirth);
            age = age + ~~((Date.now() - birthday) / (31557600000));
        }
        return age/this.props.dependents.length;
    }
    _getAverageMeds = () =>{
        let meds = 0;
        if(this.props.dependents.length<1){
            return 0;
        }
        for(var i=0;i<this.props.dependents.length;++i){
            for(var ix=0;ix<this.props.dependents[i].rxs.length;++ix){
                meds = meds + this.props.dependents[i].rxs[ix].rxsMedications.length;
            }
        }
        return (meds/this.props.dependents.length);
    }
    _deleteDependent = (dep) =>{
        if(window.confirm("Are you sure you want to delete "+dep.name.firstName+" profile and all their data?")){
            this.props.fetchDeleteDependent(dep._id);
        }
    }
    componentDidMount = () =>{
        this.props.fetchPopulatedDependents();
    }
    render() {
        return (
            <>
            {!this.state.isRedirect?
                <div className="row">
                    <div className="col-lg-12">
                        {!this.state.isOverview?
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
                            :
                            null
                        }
                        <div className="row">
                            {!this.state.isOverview?
                                <div className="col-lg-12">
                                    {this.props.dependents.length>0?
                                    <DependentTable dependents={this.props.dependents} delete={this._deleteDependent} 
                                        toggleRedirect={this._toggleRedirect}/>
                                    :null}
                                </div>
                                :
                                <>
                                   <div className="col-lg-6">
                                        {this.props.dependents?
                                        <DependentTable toggleRedirect={this._toggleRedirect} dependents={this.props.dependents}
                                            isSmall={true} selected={this.state.isOverview._id}/>
                                        :null}
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card" style={{padding:"20px"}}>
                                            <CreateDependent isDepSelected={this.state.isOverview}/>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
                :<Redirect push to={this.state.isRedirect}/>
                }
            </>
        );
    }
}
DependentView.propTypes = {
    fetchLogin: PropTypes.func.isRequired,
    fetchPopulatedDependents: PropTypes.func.isRequired,
    fetchDeleteDependent: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependents: state.dependents,
    groups: state.groups
});

export default connect(mapStateToProps, { fetchLogin, fetchDeleteDependent, togglePopUp, fetchPopulatedDependents})(DependentView);