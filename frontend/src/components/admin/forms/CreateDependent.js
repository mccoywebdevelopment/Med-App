import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group'
import { submitNewDependent } from '../../../actions/dependent';

import DepOverview from './DepOverview';

class CreateDependent extends React.Component {
    static propTypes = {
        dependents: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this._update = this._update.bind(this);
        this._updateError = this._updateError.bind(this);
    }
    state = {
        overview:{
            errors:{
                name:"",
                dateOfBirth:"",
                group:""
            },
            values:{
                name:"",
                dateOfBirth:"",
                group:""
            },
            body:null
        }
    }
    _update(form,inputName,value){
        let newState = this.state;
        newState[form].values[inputName] = value;
        this.setState(newState);
        console.log(this.state);
    }
    _updateError(form,name,value){
        let newState = this.state;
        newState[form].errors[name] = value;
        this.setState(newState);
        console.log(this.state);
    }
    componentDidMount = () =>{
        this.props.fetchGroups();
    }
    render() {
        return (
            <>
                <div className="row">
                    {this.props.groups.all?
                    <DepOverview data={this.state.overview} update={this._update} groups={this.props.groups.all} updateError={this._updateError}/>
                    :null}
                </div>
                <div className="row">
                    <button className="btn btn-primary" onClick={()=>{this.props.submitNewDependent()}}>Submit</button>
                </div>
            </>

        );
    }
}

CreateDependent.propTypes = {
    submitNewDependent: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
    dependents: state.dependents,
    groups: state.groups
});

export default connect(mapStateToProps, { submitNewDependent, fetchGroups })(CreateDependent);