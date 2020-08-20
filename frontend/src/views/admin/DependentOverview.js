import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DependentTableSm from "../../components/admin/tables/DependentTableSm";
import ViewDependent from "../../components/admin/ViewDependent/ViewDependent";
import DependentTable from "../../components/admin/tables/DependentTable";
import CreateDependent from "../../components/admin/forms/CreateDependent";

class DependentOverview extends React.Component{
    static propTypes = {
        dependents: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="col-lg-6">
                    {this.props.dependents?
                    <DependentTable dependents={this.props.dependents} isSmall={true}/>
                    :null}
                </div>
                <div className="col-lg-6">
                    {/* <ViewDependent isEdit={true}/> */}
                    <div className="card" style={{padding:"20px"}}>
                        <CreateDependent isEdit={true}/>
                    </div>
                </div>
            </>
        );
    }
}
const mapStateToProps = (state) => ({
    dependents: state.dependents,
    groups: state.groups
});
export default connect(mapStateToProps,null)(DependentOverview);