import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";
import { togglePopUp } from '../../actions/popUp';
import { fetchPopulatedDependentsUser } from "../../actions/dependent";
import { changeColor } from "../../actions/theme";

import DependentTable from "../../components/admin/tables/DependentTable";
import Overview from "../../components/admin/Overview/Overview";

class DependentViewUser extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        dependentState: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
        this._toggleRedirect = this._toggleRedirect.bind(this);
    }
    state = {
        filterBy:{
            all:true,
            groups:[],
            index:null
        }
    }
    _formatFilterGroups = () =>{
        let newState = this.state;
        let groupArr = [];
        /*
        {
            dependents:[],
            name:String,
            _id:String
        }
        */
        for(var i=0;i<this.props.dependentState.data.length;++i){
            let found = false;
            for(var ix=0;ix<groupArr.length;++ix){
                if(groupArr[ix]._id == this.props.dependentState.data[i].group._id){
                    found = true;
                    groupArr[ix].dependents.push(this.props.dependentState.data[i]);
                    break;
                }
            }
            if(!found){
                groupArr.push({
                    _id:this.props.dependentState.data[i].group._id,
                    name:this.props.dependentState.data[i].group.name,
                    dependents:[this.props.dependentState.data[i]]
                });
            }
        }
        newState.filterBy.groups = groupArr;
        this.setState(newState);
    }
    _getTotalNumberOfDependents = () => {
        return this.props.dependentState.data.length;
    }
    _toggleRedirect = (dep) => {
        let newState = this.state;
        window.location = "/user/dependents/" + dep._id
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
            for (var ix = 0; ix < this.props.dependentState.data[i].rxs.length; ++ix) {
                meds = meds + this.props.dependentState.data[i].rxs[ix].rxsMedications.length;
            }
        }
        return (meds / this.props.dependentState.data.length);
    }
    _getData = () =>{
        if(this.state.filterBy.all){
            return this.props.dependentState.data;
        }else{
            let index = this.state.filterBy.index;
            return this.state.filterBy.groups[index].dependents
        }
    }
    _toggleFilterBy = (all,index) =>{
        let newState = this.state;
        
        if(all){
            newState.filterBy.all = true;
            newState.filterBy.index = null;
        }else{
            newState.filterBy.all = false;
            newState.filterBy.index = index;
        }

        this.setState(newState);
    }
    componentDidMount = () => {
        this.props.changeColor("#2196f3");
        this.props.fetchPopulatedDependentsUser(true,(done) => { 
            this._formatFilterGroups();
        });
    }

    render() {
        const filterGroupBtnsList = () =>{
            return this.state.filterBy.groups.map((group,index)=>{
                return(
                    <button id={"myButtonList9394"+index} onClick={() => { this._toggleFilterBy(false, index) }} type="button"
                        class={"btn " + (this.state.filterBy.index ==index ? "btn-primary" : "btn-outline-secondary")}>
                        {group.name}({group.dependents.length})
                    </button>
                );
            });
        }
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                    <div className="row content-mobile">
                            <div className="col-lg-12">
                                <h1>Mobile is not supported use desktop</h1>
                            </div>
                        </div>
                        <div className="row content-desktop">
                            <div className="col-lg-12">
                                <h4 className="view-header">Dependents</h4>
                            </div>
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <Overview dependentsLength={this._getTotalNumberOfDependents()} averageMed={this._getAverageMeds()}
                                    averageAge={this._getAverageAge()} />
                            </div>

                        </div>
                        <div className="row content-desktop">
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button onClick={() => { this._toggleFilterBy(true) }} type="button"
                                        class={"btn " + (this.state.filterBy.all ? "btn-primary" : "btn-outline-secondary")}>All</button>
                                    {filterGroupBtnsList()}
                                </div>
                            </div>
                        </div>
                        <div className="row content-desktop">
                            <div className="col-lg-12">
                                {this.props.dependentState.data.length > 0 ?
                                    <DependentTable dependents={this._getData()} delete={this._deleteDependent}
                                        changeDepSel={this._toggleRedirect} isUserView={true} />
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
DependentViewUser.propTypes = {
    fetchLogin: PropTypes.func.isRequired,
    fetchPopulatedDependentsUser: PropTypes.func.isRequired,
    togglePopUp: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, {
    fetchLogin, changeColor, togglePopUp,
    fetchPopulatedDependentsUser
})(DependentViewUser);