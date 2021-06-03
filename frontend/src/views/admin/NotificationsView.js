import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePopUp } from '../../actions/popUp';
import { fetchNotifications } from "../../actions/notifications"
import { changeColor } from "../../actions/theme";
import { isToday, isMonth } from '../../config/helpers';

import NotificationTable from "../../components/admin/tables/NotificationTable";
import OverviewNotifications from "../../components/admin/Overview/OverviewNotifications";

class NotificationsView extends React.Component {
    static propTypes = {
        userState: PropTypes.object.isRequired,
        groupState: PropTypes.object.isRequired,
        guardianState: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._deleteUser = this._deleteUser.bind(this);
    }
    _deleteUser = (user) => {
        if (window.confirm("Are you sure you want to delete " + user.username + " profile and all their data?")) {
            this.props.fetchDeleteUser(user._id);
        }
    }
    _getNumberOfAdmins = () => {
        let num = 0;
        for (var i = 0; i < this.props.userState.data.length; ++i) {
            if (this.props.userState.data[i].isAdmin) {
                num++;
            }
        }
        return num;
    }
    _toggleRedirect = (dep) => {
        let newState = this.state;
        window.location = "/admin/users/" + dep._id
        this.setState(newState);
    }
    _getNumberOfMonthlyNotifications = () => {
        let i = 0;
        let data = this.props.notifications.data;

        while (i < data.length && isMonth(data[i].dateCreated)) {
            i++;
        }

        return (i);
    }
    _getNumberOfTodayNotifications = () => {
        let i = 0;
        let data = this.props.notifications.data;
        while (i < data.length && isToday(data[i].dateCreated)) {
            i++;
        }

        return (i);
    }
    componentDidMount = () => {
        this.props.changeColor("rgb(33, 150, 243)");
        this.props.fetchNotifications(true, (res) => {
        });
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-lg-12">
                                <h4 className="view-header">Missed Medication(s)</h4>
                            </div>
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                <OverviewNotifications today={this._getNumberOfTodayNotifications()}
                                    month={this._getNumberOfMonthlyNotifications()} total={this.props.notifications.data.length} />
                            </div>
                            <div className="col-lg-12" style={{ marginBottom: "30px" }}>
                                &nbsp;
</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                {this.props.notifications.data.length > 0 ?
                                    <NotificationTable notifications={this.props.notifications.data}
                                        delete={this._deleteUser} changeUserSel={this._toggleRedirect} />
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
NotificationsView.propTypes = {
    togglePopUp: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    fetchDeleteUser: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    fetchGuardians: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    userState: state.userState,
    groupState: state.groupState,
    guardianState: state.guardianState,
    notifications: state.notifications
});

export default connect(mapStateToProps, { changeColor, togglePopUp, fetchNotifications })(NotificationsView);