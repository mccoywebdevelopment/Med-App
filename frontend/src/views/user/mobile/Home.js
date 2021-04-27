import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchGetFilteredMedications } from '../../../actions/user';
import { formatDateHome, isBetween } from '../../../config/helpers';

import UserHeader from "../../../components/user/header/UserHeader";
import Progress from "../../../components/user/charts/Progress";
import NavItems from "../../../components/user/nav/NavItems";
import MedicationCardList from "../../../components/user/cards/MedicationCardList";
import ViewMed from './ViewMed';

class Home extends React.Component {
    state = {
        navItems: {
            names: ["Morning", "Afternoon", "Evening"],
            indexSelected: 0,
            prevSelected: 0
        },
        morning: null,
        afternoon: null,
        evening: null,
        currentView: "Home",
        currentTime: null,
        medications: [],
        currentMeds: {
            active: [],
            history: []
        },

        morningMedsActive: [],
        morningMedsHistory: [],

        afternoonMedsActive: [],
        afternoonMedsHistory: [],

        eveningMedsActive: [],
        eveningMedsHistory: [],

        postPopUp: {
            data: null,
            isHistory: false
        }
    }
    constructor(props) {
        super(props);
        this._selectNav.bind(this);
    }
    _selectNav = (index) => {
        let newState = this.state;
        newState.navItems.prevSelected = newState.navItems.indexSelected;
        newState.navItems.indexSelected = index;
        this.setState(newState);
        this._setCurrentMeds();
    }
    _setInitNav = () => {
        let morning = this.state.morning;
        let afternoon = this.state.afternoon;
        let today = new Date();

        let morningStart = Date.parse(formatDateHome(today) + " " + morning[0]);
        let morningEnd = Date.parse(formatDateHome(today) + " " + morning[1]);

        let afternoonStart = Date.parse(formatDateHome(today) + " " + afternoon[0]);
        let afternoonEnd = Date.parse(formatDateHome(today) + " " + afternoon[1]);

        let newState = this.state;
        if (isBetween(today, morningStart, morningEnd)) {
            this._selectNav(0);
        } else if (isBetween(today, afternoonStart, afternoonEnd)) {
            this._selectNav(1);
        } else {
            this._selectNav(2);
        }

        this.setState(newState);
    }
    _setCurrentMeds = () => {
        let index = this.state.navItems.indexSelected;
        let newState = this.state;

        if (index == 0) {
            newState.currentMeds.active = newState.morningMedsActive;
            newState.currentMeds.history = newState.morningMedsHistory;
        } else if (index == 1) {
            newState.currentMeds.active = newState.afternoonMedsActive;
            newState.currentMeds.history = newState.afternoonMedsHistory;
        } else {
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
    _getProgress = () => {
        let total = 0;
        let history = this.state.morningMedsHistory.length + this.state.afternoonMedsHistory.length +
            this.state.eveningMedsHistory.length;
        total = history + this.state.morningMedsActive.length + this.state.afternoonMedsActive.length +
            this.state.eveningMedsActive.length;
        return ({
            txt: history + "/" + total + " Medication(s) Administered",
            width: (history / total)
        })
    }
    _selectMedCard = (med, isHistory) => {
        let newState = this.state;
        newState.postPopUp.data = med;
        newState.postPopUp.isHistory = isHistory;
        this.setState(newState);
    }
    _setFilteredMeds = (data) =>{
        let newState = this.state;
        newState.morning = data.morning;
        newState.afternoon = data.afternoon;
        newState.evening = data.evening;
        newState.morningMedsActive = data.activeArr.morningMedsActive;
        newState.morningMedsHistory = data.historyArr.morningMedsHistory;
        newState.afternoonMedsActive = data.activeArr.afternoonMedsActive;
        newState.afternoonMedsHistory = data.historyArr.afternoonMedsHistory;
        newState.eveningMedsActive = data.activeArr.eveningMedsActive;
        newState.eveningMedsHistory = data.historyArr.afternoonMedsHistory;
        this.setState(newState);
        this._setCurrentMeds();
        this._setInitNav();
    }
    componentDidMount = () => {
        this._setCurrentTime();
        this.props.fetchGetFilteredMedications((data) => {
            console.log(data);
            if(data && data.activeArr){
                this._setFilteredMeds(data);
            }
        });
    }
    _renderPopUp = () => {
        return (
            <ViewMed isHistory={this.state.postPopUp.isHistory} data={this.state.postPopUp.data}
                togglePopUp={this._selectMedCard} />
        )
    }
    _renderHome = () => {
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
                    {this.state.currentMeds.active.length > 0 || this.state.currentMeds.history.length > 0 ?
                        <MedicationCardList activeMeds={this.state.currentMeds.active}
                            historyMeds={this.state.currentMeds.history}
                            period={this.state.navItems.names[this.state.navItems.indexSelected]}
                            selectMedCart={this._selectMedCard.bind(this)} />
                        : null}
                </div>
            </>
        );
    }
    render() {
        return (
            <>
                {this.state.postPopUp && this.state.postPopUp.data ?
                    this._renderPopUp()
                    :
                    this._renderHome()
                }
            </>
        );
    }
}

Home.propTypes = {
    auth: PropTypes.object.isRequired,
    dependentState: PropTypes.object.isRequired,
    fetchGetFilteredMedications: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, { fetchGetFilteredMedications })(Home);