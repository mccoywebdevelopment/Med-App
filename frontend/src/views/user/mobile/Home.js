import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserHeader from "../../../components/user/header/UserHeader";
import Progress from "../../../components/user/charts/Progress";
import NavItems from "../../../components/user/nav/NavItems";

class Home extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        dependentState: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);

        this._selectNav.bind(this);
    }
    state = {
        navItems:{
            names:["Morning","Afternoon","Evening"],
            indexSelected:0,
            prevSelected:0
        }
    }
    _selectNav = (index) =>{
        let newState = this.state;
        newState.navItems.prevSelected = newState.navItems.indexSelected;
        newState.navItems.indexSelected = index;
        this.setState(newState);     
        console.log(this.state)   
    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <UserHeader header={"Today's Status"} subHeader="3/5 Medication(s) Administered"/>
                    </div>
                    <div className="col-12">
                        <Progress width={1/5}/>
                    </div>
                </div>
                <div className="row" style={{paddingTop:'20px'}}>
                    <NavItems toggle={this._selectNav} items={this.state.navItems}/>
                </div>
            </>
        );
    }
}
Home.propTypes = {
};
const mapStateToProps = (state) => ({
    auth: state.auth,
    dependentState: state.dependentState,
});

export default connect(mapStateToProps, {})(Home);