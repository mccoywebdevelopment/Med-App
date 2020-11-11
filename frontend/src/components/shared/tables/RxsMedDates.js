import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMedEvents } from '../../../actions/event';
import { togglePopUp } from '../../../actions/popUp';
import { formateDate } from "../../../config/helpers";

class RxsMedDates extends React.Component {
    state = {
        rxsMedEvents: []
    }
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.props.fetchMedEvents(this.props.rxsMedID, true, (res) => {
            let newState = this.state;
            newState.rxsMedEvents = res.events;
            this.setState(newState);
        });
    }
    render() {
        const list = () => {
            return this.state.rxsMedEvents.map((event, index) => {
                return(
                    <tr index={"lkjmedTableInsasdl4***&^" + index}>
                        <td>{index + 1}</td>
                        <td>{formateDate(event.dateTaken)}</td>
                        <td>{event.createdBy.name.firstName + " " + event.createdBy.name.lastName}</td>
                        <td>{event.isAway.toString()}</td>
                        <td>{event.notes || "-"}</td>
                        <td></td>
                    </tr>
                );
            });
        }
        return (
            <div style={{minHeight:'30em',width:'100%'}}>
            {this.state.rxsMedEvents.length>0?
            <table className="table my-med-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date Given</th>
                        <th scope="col">Administer By</th>
                        <th scrop="col">Is Away</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list()}
                </tbody>
            </table>
            :<h1 style={{textAlign:'center',marginTop:'10%'}}>No Events Registered.</h1>}
            </div>
        );
    }
}

RxsMedDates.propTypes = {
    fetchMedEvents: PropTypes.func.isRequired,
};

export default connect(null, { fetchMedEvents, togglePopUp })(RxsMedDates);