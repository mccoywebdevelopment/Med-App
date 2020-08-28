import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPopulatedDependents } from '../../actions/dependent';

import DependentTable from '../../components/admin/tables/DependentTable';
import CreateDependent from '../../components/admin/forms/CreateDependent';

class DependentDetails extends React.Component{
    static propTypes = {
        dependentState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
    }
    componentDidMount =()=>{
        if(!this.props.dependentState.fetched){
            this.props.fetchPopulatedDependents(()=>{});
        }
    }
    render(){
        return(
            <>
                <div className="col-lg-6">
                    {this.props.dependents?
                    <DependentTable toggleRedirect={this._toggleRedirect} dependents={this.props.dependents}
                        isSmall={true}/>
                    :null}
                </div>
                <div className="col-lg-6">
                    <div className="card" style={{padding:"20px"}}>
                        {/* <CreateDependent isDepSelected={this.state.isOverview}/> */}
                    </div>
                </div>
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