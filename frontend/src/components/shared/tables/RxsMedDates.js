import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMedEvents, fetchDeleteMedEvent} from '../../../actions/event';
import { togglePopUp } from '../../../actions/popUp';
import { formateDate, formatAMPM } from "../../../config/helpers";

import TookMed from "../../user/forms/TookMed";
import WhenToTake from "../../shared/Misc/WhenToTake";

class RxsMedDates extends React.Component {
    state = {
        rxsMedEvents: [],
        list: [],
        left: [],
        showMore: false
    }
    constructor(props) {
        super(props);
    }
    _formatList = (list, left) => {
        let newState = this.state;
        newState.list = list;
        newState.left = left;
        this.setState(newState);
    }
    _delete = (index) =>{
        let event = this.state.list[index];
        if (window.confirm("Are you sure you want to delete " + event.title + " on " +formateDate(event.dateTaken))) {
            this.props.fetchDeleteMedEvent(event._id,true,(res)=>{
                this.props.fetchMedEvents(this.props.rxsMedID, true, (res) => {
                    this._init(res);
                });
            });
        }
    }
    _edit = (index) =>{
        let event = this.state.list[index];
        let title = "Edit " + event.title + " on " + formateDate(event.dateTaken);
        let isEdit = {
            dateTaken:formateDate(event.dateTaken),
            notes:event.notes,
            isAway:event.isAway,
        }
        this.props.togglePopUp(title, <TookMed eventID={event._id} medName={this.props.medName} isEdit={isEdit} medID={this.props.rxsMedID} data={this.props.data} />);
    }
    _toggleShowMore = () =>{
        let newState = this.state;
        newState.showMore = !newState.showMore;
        this.setState(newState);
        this._getList();
    }
    _getList = () => {
        let left = [];
        let list = this.state.rxsMedEvents;

        if (this.state.rxsMedEvents && this.state.rxsMedEvents.length > 2 && !this.state.showMore) {
            for (var i = 2; i < this.state.rxsMedEvents.length; ++i) {
                left.push(this.state.rxsMedEvents[i]);
            }
            list = [this.state.rxsMedEvents[0], this.state.rxsMedEvents[1]];
        }
        this._formatList(list, left);
    }
    _expandItem = (index,value) =>{
        let newState = this.state;
        newState.list[index].isExpand = value;
        this.setState(newState);
    }
    _sortRxsMedEvents = (medEvents) =>{
        medEvents.sort(function(a,b){
            return new Date(b.dateTaken) - new Date(a.dateTaken);
        });
        return medEvents;
    }
    _init = (res) =>{
        let newState = this.state;
        newState.rxsMedEvents = res.events;
        newState.rxsMedEvents = this._sortRxsMedEvents(newState.rxsMedEvents);
        this.setState(newState);
        this._getList();
    }
    componentDidMount = () => {
        this.props.fetchMedEvents(this.props.rxsMedID, true, (res) => {
            this._init(res);
        });
    }
    render() {

        const listTable = () => {
            return this.state.list.map((element, index) => {
                let style = {
                    background: 'inherit'
                }
                if (index % 2 == 0) {
                    // style.background = "#ededed";
                }
                return (
                    <React.Fragment key={"slk3(((asdf" + index}>
                        <tr index={"medTable^&*&^" + index} style={style}>
                            <th scope="row" style={{ paddingBottom: '0', paddingTop: '0' }}>
                                <p style={{ marginBottom: '0px', paddingTop: '10px' }}>{index + 1}</p>
                                <p onClick={() => { this._expandItem(index,true) }} title="view rest of med"
                                    style={{ color: '#2196F3', paddingTop: "5px", marginBottom: '10px', cursor: "pointer" }}>
                                    {!element.isExpand ? "More" : ""}&nbsp;
                                </p>
                            </th>
                            <td>{formateDate(element.dateTaken) || "-"}</td>
                            <td>{formatAMPM(element.dateTaken) || "-"}</td>
                            <td>{element.createdByStr || "-"}</td>
                            <td>{element.isAway.toString() || "-"}</td>
                            <td>
                                <i title="edit" onClick={()=>{this._edit(index)}} className="fas fa-edit" style={{ paddingRight: '20px', color: '#2196F3' }}></i>
                                <i title="Delete" onClick={()=>{this._delete(index)}} className="fas fa-trash" style={{ color: '#2196F3' }}></i>
                            </td>
                        </tr>
                        {element.isExpand ?
                            <React.Fragment key={"slk3(((" + index}>
                                <tr index={"lkjmedTableInside^sdf&*&^" + index} className="no-border" style={style}>
                                <td></td>
                                <td colSpan="4">
                                    <span className="inner-title">Notes:</span><br /><br />{element.notes || "-"}
                                </td>
                                </tr>
                                <tr index={"mAedTableInhjkhkhside^&*&^" + index} className="no-border-top" style={style}>
                                    <th scope="row" style={{ paddingBottom: '0', paddingTop: '0', borderTop: 'none' }}>
                                        <p style={{ marginBottom: '0px', paddingTop: '28px' }}></p>
                                        <p onClick={() => { this._expandItem(index,false) }} title="view rest of med"
                                            style={{ color: '#2196F3', paddingTop: "5px", marginBottom: '10px', cursor: "pointer" }}>{element.isExpand ? "Less" : ""}&nbsp;</p>
                                    </th>
                                </tr>
                            </React.Fragment>
                            : null
                        }
                    </React.Fragment>
                )
            })
        }
        return (
            <div style={{ minHeight: '30em', width: '100%' }}>
                <div style={{padding:'1em',marginBottom:'2em'}}>
                    <WhenToTake data={this.props.data.whenToTake}/>
                </div>  
                {this.state.rxsMedEvents && this.state.rxsMedEvents.length > 0 ?
                    <table className="table my-med-table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date Given</th>
                                <th scope="col">Time</th>
                                <th scope="col">Administer By</th>
                                <th scrop="col">Is Away</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTable()}
                        </tbody>
                    </table>
                    : 
                    <h1 style={{ textAlign: 'center', marginTop: '10%' }}>No Events Registered.</h1>
                }

                {this.state.left.length > 0 ?
                    <p onClick={this._toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3', marginBottom: '0' }}>
                        <i className="fas fa-plus" style={{ paddingRight: '10px' }}></i>
                        {this.state.left.length} More Events
                    </p>
                    : this.state.showMore && this.state.list.length > 2 ?
                        <p onClick={this._toggleShowMore} title="view" style={{ marginTop: '15px', marginLeft: '5px', cursor: 'pointer', color: '#2196F3', marginBottom: '0' }}>
                            <i className="fas fa-minus" style={{ paddingRight: '10px' }}></i>
                        Show Less
                        </p>
                        : null
                }
            </div>
        );
    }
}

RxsMedDates.propTypes = {
    fetchMedEvents: PropTypes.func.isRequired,
    fetchDeleteMedEvent: PropTypes.func.isRequired
};

export default connect(null, { fetchMedEvents, togglePopUp, fetchDeleteMedEvent })(RxsMedDates);