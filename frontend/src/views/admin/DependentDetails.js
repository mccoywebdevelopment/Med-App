import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPopulatedDependents } from '../../actions/dependent';
import { getPath } from '../../config/helpers';
import { Redirect } from 'react-router-dom';

import DependentTable from '../../components/admin/tables/DependentTable';
import CreateDependent from '../../components/admin/forms/CreateDependent';

class DependentDetails extends React.Component{
    state = {
        dependent:null,
        isRedirect:false
    }
    static propTypes = {
        dependentState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this._setDep = this._setDep.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
    }
    _findDepByID = (id) =>{
        for(var i=0;i<this.props.dependentState.data.length;++i){
            if(this.props.dependentState.data[i]._id == id){
                return this.props.dependentState.data[i];
            }
        }
        return null;
    }
    _setDep = (dep) =>{
        let newState = this.state;
        newState.dependent = dep;
        this.setState(newState);
    }
    _toggleRedirect = (depID) =>{
        let newState = this.state;
        newState.isRedirect = depID;
        this.setState(newState);
    }
    _redirectURL = () =>{
        return (
            <Redirect push to={'/admin/dependents/'+this.state.isRedirect._id} />
        );
    }
    _getID = () =>{
        if(this.state.dependent){
            return this.state.dependent._id
        }
        return "";
    }
    componentDidUpdate = () =>{
        let id = getPath(window,"end");
        if(id != this.state.dependent._id){
            this._setDep(this._findDepByID(id));
            this._toggleRedirect(false);
        }
    }
    componentDidMount =()=>{
        let id = getPath(window,"end");
        if(!this.props.dependentState.fetched){
            this.props.fetchPopulatedDependents(()=>{});
        }
        this._setDep(this._findDepByID(id));
        console.log(this.state)
    }
    render(){
        return(
            <>
            {this.state.isRedirect?
                <>
                    {this._redirectURL()}
                </>
            :
            <div className="row">
                <div className="col-lg-6">
                    {this.props.dependentState.data?
                    <DependentTable selected={this._getID()} changeDepSel={this._toggleRedirect} dependents={this.props.dependentState.data}
                        isSmall={true}/>
                    :null}
                </div>
                <div className="col-lg-6">
                    <div className="card" style={{padding:"20px"}}>
                        <CreateDependent isDepSelected={this.state.dependent}/>
                    </div>
                </div>
            </div>
            }
            </>
        )
    }
}
DependentDetails.propTypes = {
    fetchPopulatedDependents: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    dependentState: state.dependentState,
    groupState: state.groupState
});
export default connect(mapStateToProps,{fetchPopulatedDependents})(DependentDetails);