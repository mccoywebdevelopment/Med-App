
import React from 'react';
import { connect } from 'react-redux';
import { formateDate } from '../../../config/helpers';
import PropTypes from 'prop-types';
import WhenToTake from '../../../components/shared/Misc/WhenToTake'

class NotificationTable extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  render() {
    const list = (notifications) => {
      return notifications.map((notification, index) => {
        console.log(notification);
        let date = notification.dateCreated
        let period = notification.medicationMissed.period;
        let medName = "-"
        let groupName = "-"
        let dependentName = "-"
        let dependentID = "-"
        let groupID = "-"
        if(notification.medicationMissed.rxsMedication){
          medName = notification.medicationMissed.rxsMedication.name;
        }
        if(notification.medicationMissed.group){
          groupName = notification.medicationMissed.group.name;
          groupID = notification.medicationMissed.group._id;
          
          groupName = <a href={"groups/"+groupID}>{groupName}</a>;
        }
        if(notification.medicationMissed.dependent){
          dependentName = notification.medicationMissed.dependent.name.firstName + ' ' + notification.medicationMissed.dependent.name.lastName
          dependentID = notification.medicationMissed.dependent._id;

          dependentName = <a href={"dependents/"+dependentID}>{dependentName}</a>
        }
        
        return (
          <tr key={"userTable" + index}>
            <th scope="row">{index + 1}</th>
            <td>{formateDate(date)}</td>
            <td colSpan="1"><WhenToTake data={[period]}/></td>
            <td>{medName}</td>
            <td>{dependentName}</td>
            <td>{groupName}</td>


            {/* {!this.props.isSmall ?
              <td>
                <i title="Delete" onClick={() => { this.props.delete(notification) }} className="fas fa-trash"
                  style={{ color: this.props.theme.pagePrimaryColor,paddingLeft:'1em' }}></i>
              </td>
              : null} */}
          </tr>
        );
      });
    }
    return (
      <table className="table dependentTable table-no-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" colSpan="1">Date</th>
            <th scope="col" colSpan="1">Period</th>
            <th scope="col" colSpan="1">Medication</th>
            <th scope="col" colSpan="1">Dependent</th>
            <th scope="col" colSpan="1">Group</th>
            {/* {!this.props.isSmall ? <th scope="col">Actions</th> : null} */}
          </tr>
        </thead>
        <tbody>
          {list(this.props.notifications)}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps, {})(NotificationTable);