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
            alert(JSON.stringify(res));
            let newState = this.state;
            newState.rxsMedEvents = res;
            this.setState(newState);
        });
    }
    _findGuardianByID = (id) =>{

    }
    render() {
        const list = () => {
            return this.state.rxsMedEvents.map((event, index) => {
                return(
                    <tr index={"lkjmedTableInsasdl4***&^" + index} className="no-border">
                        <td>{event.index + 1}</td>
                        <td>{formateDate(event.dateTaken)}</td>
                        <td></td>
                    </tr>
                );
            });
        }
        return (
            <table className="table my-med-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date Given</th>
                        <th scope="col">Administer By</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {list()} */}
                </tbody>
            </table>
        );
    }
}

RxsMedDates.propTypes = {
    fetchMedEvents: PropTypes.func.isRequired,
};

export default connect(null, { fetchMedEvents, togglePopUp })(RxsMedDates);