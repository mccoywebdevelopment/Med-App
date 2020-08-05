import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGroups } from '../../../actions/group';
import { firstAndLastNameValidator, prevDateValidator} from '../../../config/validators';
import SearchBox from './SearchBox'

class DepOverview extends React.Component {
    static propTypes = {
        groups: PropTypes.object.isRequired,
        dependents: PropTypes.object.isRequired
    };
    state = {
        nameError: "",
        dateOfBirthError: "",
        groupError: "",
        didFetchGroups: false,
        groupValue: "",
        groupSelect: ""
    }
    constructor(props) {
        super(props);
        if (this.props.data) {
            this._setPropsData();
        } else {
            this._setEmptyData();
        }
        if(this.props.dependents.newDep.isSubmit){
            this._validation();
        }
    }
    _updateFormData = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
      }
    _setGroupInput = (value,select,id) =>{
        let newState = this.state;
        if(value){
            newState.groupValue = value;
        }
        if(select){
            newState.groupSelect = select;
        }
        if(id){
            newState.belongsToGroup = id;
        }
        this.setState(newState);
        console.log(this.state);
    }
    _groupValidator = () =>{
        let newState = this.state;
        if(this.state.groupSelect == this.state.groupValue && this.state.groupValue.length>0){
            newState.groupError = false;
        }else{
            newState.groupError = "This field is required.";
        }
        this.setState(newState);
    }
    _setPropsData = () => {
        this.state = {
            ...this.state,
            name: this.props.data['name'],
            dateOfBirth: this.props.data['dateOfBirth'],
            belongsToGroup: this.props.data['group']
        }
    }
    _setEmptyData = () => {
        this.state = {
            ...this.state,
            name: "",
            dateOfBirth: "",
            belongsToGroup: false
        }
    }
    _validation = () =>{
        let newState = this.state;
        newState.nameError = firstAndLastNameValidator(newState.name,true).errorMsg;
        newState.dateOfBirthError = prevDateValidator(newState.dateOfBirth,true).errorMsg;
        
        this.setState(newState);
      }
      _submit = (e) =>{
        e.preventDefault();
        
        this._validation();
        if(this.state.passwordErrMsg.length<1 && this.state.emailErrMsg.length<1){
          let body = {
            username:this.state.email,
            password:this.state.password
          }
          this.props.fetchLogin(body);
        }
      }
    _toggleBelongsToGroupOption = () => {
        let newState = this.state;
        if (newState.belongsToGroup) {
            newState.belongsToGroup = false;
        } else {
            newState.belongsToGroup = true;
            if(!newState.didFetchGroups){
                this.props.fetchGroups();
                newState.didFetchGroups = true;
            }
        }
        this.setState(newState);
    }
    componentDidUpdate =() =>{
        if(this.props.groups.length<1 && this.state.didFetchGroups){
            alert("WARNING: There are no groups that are created. Please make a group first before proceeding.")
        }
    }
    _getSearchBoxData = () => {
        let data = [];
        for(var i=0;i<this.props.groups.length;++i){
            data.push({key:this.props.groups[i]._id,value:this.props.groups[i].name});
        }
        return data;
    }
    render() {
        return (
            <>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="label">Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="First & Last Name"
                                value={this.state.name} onChange={this._updateFormData} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.state.nameError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="label">Date of Bith</label>
                        <div className="input-group">
                            <input type="date" className="form-control" name="dateOfBirth" placeholder="mm/dd/yyyy"
                                value={this.state.dateOfBirth} onChange={this._updateFormData} />
                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                {this.state.dateOfBirthError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Belongs to Group</label>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4" style={{ paddingLeft: '0px' }}>
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input" 
                                        name="membershipRadios" id="membershipRadios1" value="Yes" 
                                        onClick={() => { this._toggleBelongsToGroupOption() }} 
                                        checked={this.state.belongsToGroup} aria-describedby="passwordHelpBlock"/>
                                        Yes 
                                        <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-radio">
                                <label className="form-check-label">
                                    <input readOnly={true} type="radio" className="form-check-input" name="membershipRadios"
                                     id="membershipRadios2" value="no" onClick={() => { this._toggleBelongsToGroupOption() }} 
                                        checked={!this.state.belongsToGroup || (this.state.didFetchGroups && this.props.groups.length<1) } />
                                        No <i className="input-helper"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-lg-4 my-search-box "+(!this.state.belongsToGroup || (this.state.didFetchGroups && this.props.groups.length<1)? 'my-hidden':'')}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="label">Group Name</label>
                    </div>
                    <SearchBox _setGroupInput={this._setGroupInput} data={this._getSearchBoxData()} placeholder={"Enter Group Name"}/>
                </div>
            </>
        );
    }
}
DepOverview.propTypes = {
    fetchGroups: PropTypes.func.isRequired
  };
  const mapStateToProps = (state) => ({
    groups: state.groups,
    dependents: state.dependents
  });

export default connect(mapStateToProps,{fetchGroups})(DepOverview);

