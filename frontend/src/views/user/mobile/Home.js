import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPopulatedDependentsUser } from '../../../actions/dependent';

import UserHeader from "../../../components/user/header/UserHeader";
import Progress from "../../../components/user/charts/Progress";
import NavItems from "../../../components/user/nav/NavItems";
import MedicationCardList from "../../../components/user/cards/MedicationCardList";

class Home extends React.Component {
    state = {
        navItems: {
            names: ["Morning", "Afternoon", "Evening"],
            indexSelected: 0,
            prevSelected: 0
        },
        morning:["4:00 AM", "11:59 AM"],
        afternoon:["12:00 PM", "5:59 PM"],
        evening:["5:59 PM", "11:00 PM"],
        currentView: "Home",
        currentTime: null,
        medications: [],
        currentMeds:{
            active:[],
            history:[]
        },

        morningMedsActive: [],
        morningMedsHistory: [],

        afternoonMedsActive: [],
        afternoonMedsHistory: [],

        eveningMedsActive: [],
        eveningMedsHistory: [],
    }
    constructor(props) {
        super(props);
        this._selectNav.bind(this);
        this._filterMedications.bind(this);
    }
    _selectNav = (index) => {
        let newState = this.state;
        newState.navItems.prevSelected = newState.navItems.indexSelected;
        newState.navItems.indexSelected = index;
        this.setState(newState);
        this._setCurrentMeds();
    }
    _isToday = (someDate) => {
        if(!someDate){
            return false;
        }
        someDate = new Date(someDate);
        let today = new Date();
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }
    _formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    isBetween(time,start,end){
        let today = new Date(time);
        if(start<= today && today<= end){
            return true
        }
        return false;
    }
    isLessThan(end){
        let today = new Date();
        if(today<= end){
            return true
        }
        return false;
    }
    _setInitNav = () =>{
        let morning = this.state.morning;
        let afternoon = this.state.afternoon;
        let today = new Date();

        let morningStart = Date.parse(this._formatDate(today) + " " + morning[0]);
        let morningEnd = Date.parse(this._formatDate(today) + " " + morning[1]);

        let afternoonStart = Date.parse(this._formatDate(today) + " " + afternoon[0]);
        let afternoonEnd = Date.parse(this._formatDate(today) + " " + afternoon[1]);

        let newState = this.state;
        if(this.isBetween(today,morningStart,morningEnd)){
            this._selectNav(0);
        }else if(this.isBetween(today,afternoonStart,afternoonEnd)){
            this._selectNav(1);
        }else{
            this._selectNav(2);
        }
        this.setState(newState);
    }
    _filterMedications = () => {
        let deps = this.props.dependentState.data;

        let morning = this.state.morning;
        let afternoon = this.state.afternoon;
        let evening = this.state.evening;
        let today = new Date();

        let morningStart = Date.parse(this._formatDate(today) + " " + morning[0]);
        let morningEnd = Date.parse(this._formatDate(today) + " " + morning[1]);

        let afternoonStart = Date.parse(this._formatDate(today) + " " + afternoon[0]);
        let afternoonEnd = Date.parse(this._formatDate(today) + " " + afternoon[1]);

        let eveningStart = Date.parse(this._formatDate(today) + " " + evening[0]);
        let eveningEnd = Date.parse(this._formatDate(today) + " " + evening[1]);

        let morningMedsActive = [];
        let morningMedsHistory = [];
        let afternoonMedsActive = [];
        let afternoonMedsHistory = [];
        let eveningMedsActive = [];
        let eveningMedsHistory = [];

        for (var i = 0; i < deps.length; ++i) {
            for (var ix = 0; ix < deps[i].rxs.length; ++ix) {
                for (var z = 0; z < deps[i].rxs[ix].rxsMedications.length; ++z) {
                        let whenToTake = deps[i].rxs[ix].rxsMedications[z].whenToTake;
                        let events = deps[i].rxs[ix].rxsMedications[z].events;
                        let lastTaken = events[events.length - 1].dateTaken;

                        if (whenToTake.includes('morning')) {
                            if (this.isLessThan(morningEnd) && !this._isToday(lastTaken)) {
                                morningMedsActive.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            }else if(this.isBetween(lastTaken,eveningStart,eveningEnd) && this._isToday(lastTaken)){
                                morningMedsHistory.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            }
                        }
                        if (whenToTake.includes('afternoon')) {
                            if (this.isLessThan(afternoonEnd) && !this._isToday(lastTaken)) {
                                afternoonMedsActive.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            }else if(this.isBetween(lastTaken,afternoonStart,afternoonEnd) && this._isToday(lastTaken)){
                                afternoonMedsHistory.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            }
                        }
                        if (whenToTake.includes('evening')) {
                            if (this.isLessThan(eveningEnd) && !this._isToday(lastTaken)) {
                                eveningMedsActive.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            }else if(this.isBetween(lastTaken,eveningStart,eveningEnd) && this._isToday(lastTaken)){
                                eveningMedsHistory.push({
                                    dependent:deps[i],
                                    rxs:deps[i].rxs[ix],
                                    rxsMedication:deps[i].rxs[ix].rxsMedications[z]
                                });
                            } 
                    }
                }
            }
        }

        let newState = this.state;
        newState.morningMedsActive = morningMedsActive;
        newState.morningMedsHistory = morningMedsHistory;
        newState.afternoonMedsActive = afternoonMedsActive;
        newState.afternoonMedsHistory = afternoonMedsHistory;
        newState.eveningMedsActive = eveningMedsActive;
        newState.eveningMedsHistory = afternoonMedsHistory;
        
        this.setState(newState);
        this._setCurrentMeds();
    }
    _setCurrentMeds = () =>{
        let index = this.state.navItems.indexSelected;
        let newState = this.state;

        if(index == 0){
            newState.currentMeds.active = newState.morningMedsActive;
            newState.currentMeds.history = newState.morningMedsHistory;
        }else if(index == 1){
            newState.currentMeds.active = newState.afternoonMedsActive;
            newState.currentMeds.history = newState.afternoonMedsHistory;
        }else{
            newState.currentMeds.active = newState.eveningMedsActive;
            newState.currentMeds.history = newState.eveningMedsHistory;
        }
        this.setState(newState);
    }
    _setCurrentTime = () => {
        let newState = this.state;
        let date = new Date();
        newState.currentTime = date;
        this.setState(newState);
    }
    _getProgress = () =>{
        let total = 0;
        let history = this.state.morningMedsHistory.length + this.state.afternoonMedsHistory.length +
            this.state.eveningMedsHistory.length;
        total = history + this.state.morningMedsActive.length + this.state.afternoonMedsActive.length + 
            this.state.eveningMedsActive.length;
        return({
            txt:history + "/" + total + " Medication(s) Administered",
            width:(history/total)
        })
    }
    componentDidMount = () => {
        this._setCurrentTime();
        this.props.fetchPopulatedDependentsUser(true, (data) => {
            this._filterMedications();
            this._setInitNav();
            console.log(this.state);
        });
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <UserHeader header={"Today's Status"} subHeader={this._getProgress().txt} />
                    </div>
                    <div className="col-12">
                        <Progress width={this._getProgress().width} />
                    </div>
                </div>
                <div className="row" style={{ paddingTop: '20px', zIndex: 1000 }}>
                    <NavItems toggle={this._selectNav} items={this.state.navItems} />
                </div>
                <div className="row" style={{ paddingTop: '20px' }}>
                    {this.state.currentMeds.active.length > 0  || this.state.currentMeds.history.length > 0?
                        <MedicationCardList activeMeds={this.state.currentMeds.active} 
                            historyMeds={this.state.currentMeds.history} 
                            period={this.state.navItems.names[this.state.navItems.indexSelected]} />
                        : null}
                </div>
            </>
        );
    }
}
Home.propTypes = {
    auth: PropTypes.object.isRequired,
    dependentState: PropTypes.object.isRequired,
    fetchPopulatedDependentsUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, { fetchPopulatedDependentsUser })(Home);