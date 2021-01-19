import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPopulatedDependents, fetchDeleteDependent } from "../../actions/dependent";
import { getPath } from '../../config/helpers';
import { Redirect } from 'react-router-dom';
import { browserHistory } from 'react-router';

import DependentTable from '../../components/admin/tables/DependentTable';
import CreateDependent from '../../components/admin/forms/dependent/CreateDependent';

class DependentDetails extends React.Component{
    state = {
        dependent:null,
        isRedirect:false,
        goHome:false
    }
    static propTypes = {
        dependentState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this._setDep = this._setDep.bind(this);
        this._toggleRedirect = this._toggleRedirect.bind(this);
        this._toggleHome = this._toggleHome.bind(this);
        this._deleteDependent = this._deleteDependent.bind(this);
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
    _toggleRedirect = (dep) =>{
        if(!dep){
            let newState = this.state;
            newState.isRedirect = false;
            this.setState(newState);
        }else if(dep._id != this.state.dependent._id){
            let newState = this.state;
            newState.isRedirect = dep._id;
            this.setState(newState);
        }
    }
    _updateDependent = (id) =>{
        this._setDep(this._findDepByID(id));
    }
    _redirectURL = () =>{
        return (
            <Redirect push to={'/user/dependents/'+this.state.isRedirect} />
        );
    }
    _goHome = () =>{
        return (
            <Redirect push to={'/user/dependents/'} />
        );
    }
    _getID = () =>{
        if(this.state.dependent){
            return this.state.dependent._id
        }
        return "";
    }
    _toggleHome = () =>{
        let newState = this.state;
        newState.goHome = true;
        this.setState(newState);
    }
    _deleteDependent = (dep) =>{
        if(window.confirm("Are you sure you want to delete "+dep.name.firstName+" profile and all their data?")){
            let isRedirect = false;
            let isHome = false;
            if(this.props.dependentState.data.length<2){
                isHome = true;
            }else{
                for(var i=0;i<this.props.dependentState.data.length;++i){
                    if(this.props.dependentState.data[i]._id != dep._id){
                        isRedirect = this.props.dependentState.data[i];
                        break;
                    }
                }
            }
            this.props.fetchDeleteDependent(dep._id);
            if(isHome){
                this._toggleHome();
            }else{
                this._toggleRedirect(isRedirect);
            }
        }
    }
    componentDidUpdate = () =>{
        let id = getPath(window,"end");
        if(!this.state.dependent || id != this.state.dependent._id && !this.state.goHome){
            this._setDep(this._findDepByID(id));
            this._toggleRedirect(false);
        }else if(id != this.state.dependent._id){
            this._setDep(this._findDepByID(id));
        }

        if(!this.state.dependent){
            this.setState({...this.state,goHome:true});
        }
    }
    componentDidMount =()=>{
        let id = getPath(window,"end");
        
        if(!this.props.dependentState.fetched){
            this.props.fetchPopulatedDependents(()=>{});
        }
        this._setDep(this._findDepByID(id));

        if(!this.state.dependent){
            this.setState({...this.state,goHome:true});
        }

        this.backListener = browserHistory.listen(location => {
            if (location.action === "POP") {
                id = getPath(window,"end");
                this._setDep(this._findDepByID(id));
            }
        });
    }
    render(){
        return(
            <>
            {this.state.isRedirect?
                <>
                    {this._redirectURL()}
                </>
            :this.state.goHome?
                <>
                    {this._goHome()}
                </>
            :
            <div className="row">
                <div className="col-lg-6" style={{paddingLeft:'0px'}}>
                    {this.props.dependentState.data?
                    <DependentTable selected={this._getID()} changeDepSel={this._toggleRedirect} 
                        dependents={this.props.dependentState.data} isSmall={true} isUserView={true}/>
                    :null}
                </div>
                <div className="col-lg-6 my-overview" style={{padding:'none'}} style={{paddingRight:'0px'}}>
                    <div className="card" style={{padding:"20px"}}>
                        <CreateDependent updateDep={this._updateDependent} isDepSelected={this.state.dependent} goHome={this._toggleHome}
                            isUser={true} delete={this._deleteDependent}/>
                    </div>
                </div>
            </div>
            }
            </>
        )
    }
}
DependentDetails.propTypes = {
    fetchPopulatedDependents: PropTypes.func.isRequired,
    fetchDeleteDependent: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    dependentState: state.dependentState,
    groupState: state.groupState
});
export default connect(mapStateToProps,{fetchPopulatedDependents,fetchDeleteDependent})(DependentDetails);