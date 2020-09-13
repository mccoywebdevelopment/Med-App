import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../actions/popUp';
import { fetchUsers } from "../../actions/user";
import { changeColor } from "../../actions/theme";

import UserTable from "../../components/admin/tables/UserTable";
import OverviewUser from "../../components/admin/Overview/OverviewUser";
import CreateUser from "../../components/admin/forms/user/CreateUser";

class UserView extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }
    componentDidMount = () =>{
        this.props.changeColor("#8862e0");
        this.props.fetchUsers();
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h4 className="view-header">Users</h4>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <OverviewUser dependentsLength={2}
                                     averageMed={2} averageAge={2}/>
                                </div>
                                <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                    <button type="button" 
                                    onClick={()=>{this.props.togglePopUp("Add User",<CreateUser/>,"90%")}} 
                                    className="btn btn-info btn-fw">Add</button>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.userState.data.length>0?
                                <UserTable users={[1,2,3]}/>
                                :null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
UserView.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState
});

export default connect(mapStateToProps, {changeColor, togglePopUp, fetchUsers})(UserView);