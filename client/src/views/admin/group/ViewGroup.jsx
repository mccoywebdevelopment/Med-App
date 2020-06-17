
import React from "react";
import {getAllGroups} from '../../../api/groups/Groups';
import {getAllData} from "../../../api/data/Data"
import {Container,Alert} from 'reactstrap'
import Overview from "../../../components/Overview/Overview";

class ViewGroup extends React.Component {

  state = {
    formattedData:null,
    error:{
      display:false,
      msg:null
    }
  }
  getGroups = async(error) =>{
    if(error){
      let newState = this.state;
      newState.error.display = true;
      newState.error.msg = error;
      this.setState(newState);
      this.setTimerForError();
    }else{
      let newState = this.state;
      newState.formattedData = null;
      this.setState(newState);

      let res = await getAllGroups(localStorage.getItem("JWT"));
      if(res.error){
        await this.getGroups(res.error);
      }else{
          this.setState(newState);
          this.getDataForOverview();
          return true;
      }
    }
  }
  getDataForOverview=async()=>{
    let newState = this.state;
    var data = [];
    var jwt = localStorage.getItem("JWT");
    let res = await getAllData(jwt);
    data.push({
      title:"Number of Groups:",
      data:res.groups.total
    });
    data.push({
      title:"Most Dependents In Group:",
      data:res.groups.groupWithMostDep
    });
    data.push({
      title:"Guardians to Dependents:",
      data:res.groups.guardToDep
    });
    newState.overViewData = data;
    this.setState(newState);
  }
 getPopUpForGroup = async(id)=>{
   let res = null;

     return res;
 }
 

  setTimerForError = () =>{
    let newState = this.state;
    newState.error.display = false;
    setTimeout(() => {
      this.setState(newState);
    }, 7000)
  }
  componentDidMount(){
    this.getGroups();
    // this.getPopUpForGroup();
  }

  render(){
    return(
      <>
      {this.state.error.display?<Alert color="danger">{this.state.error.msg}</Alert>:<Alert className="d-none" color="danger">{this.state.error.msg}</Alert>}
        <Container>
        {this.state.overViewData?
            <>
            <Overview data={this.state.overViewData} iconColor={["red","yellow","blue"]} iconName={["users","","chart-pie"]}/>
            </>
          :
          null}
        </Container>
      </>
    );
  }
}
  

export default ViewGroup;
