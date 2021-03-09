import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {fetchGroups} from "../../../../actions/group";


class BelongsToGroupV2 extends React.Component {
    static propTypes = {
        groupState: PropTypes.object.isRequired
    };
    state = {
        groups:[]
    }
    constructor(props){
        super(props);
    }
    _setGroupInput = (value,select,id) =>{
        id = id || "";
        this.props.update(this.props.form,"value",id);
    }
    _getSearchBoxData = () => {
        let data = [];
        for (var i = 0; i < this.props.groups.length; ++i) {
            data.push({ key: this.props.groups[i]._id, value: this.props.groups[i].name });
        }
        return data;
    }
    componentDidMount = () =>{
        if(!this.props.groupState.fetched){
            this.props.fetchGroups(true,(groups)=>{
                this.setState({...this.state,groups})
                if(groups.length<1){
                    this.props.update("empty");
                }
            });
        }else{
            this.setState({...this.state,groups:this.props.groupState.data})
            if(this.props.groupState.data<1){
                this.props.update("empty");
            }
        }
    }
    _handleChange = (e) =>{
        this.props.update(e.target.value);
    }
    render() {

        const list = () =>{
            return this.state.groups.map((group,index)=>{
                return(
                    <>
                    {this.props.group == group._id?
                        <option selected value={group._id}>{group.name}</option>
                    :
                        <option value={group._id}>{group.name}</option>
                    }
                    </>
                )
            });
        }
        return (
            <>
            {this.state.groups.length>0?
                <div className="col-lg-6">
                <div class="form-group">
                      <label for="exampleFormControlSelect2">Select Group</label>
                      <select onChange={this._handleChange} class="form-control" id="exampleFormControlSelect2">
                        <option value="">--------select group--------</option>
                        {list()}
                      </select>
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {this.props.error}&nbsp;
                    </div>
                    </div>
                </div>
                :null}
            </>
        );
    }
}
BelongsToGroupV2.propTypes = {
    fetchGroups: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
    groupState: state.groupState
});

export default connect(mapStateToProps, {
    fetchGroups
})(BelongsToGroupV2);


