import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLogin } from "../../actions/auth";

import DependentTable from "../../components/admin/tables/DependentTable";
import Overview from "../../components/admin/Overview/Overview";

class DependentView extends React.Component {
    /*
    Height for the table when user selects Dependent will be the max height of the 
    ViewDependent.
    */
    static propTypes = {
        auth: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                        {!this.props.children ?
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Dependents</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <Overview />
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <button type="button" className="btn btn-primary btn-fw">Create</button>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div className="row">
                            {!this.props.children ?
                                <div className="col-lg-12">
                                    <DependentTable />
                                </div>
                                :
                                <>
                                    {this.props.children}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
DependentView.propTypes = {
    fetchLogin: PropTypes.func.isRequired,
    changeRedirectURL: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { fetchLogin })(DependentView);