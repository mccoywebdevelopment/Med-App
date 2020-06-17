
import React from "react";
import {getAllUsers} from "../../../api/users/Users";
import {getAllData} from "../../../api/data/Data"
import Overview from "../../../components/Overview/Overview";
import {Container,Alert} from 'reactstrap'

class ViewUsers extends React.Component {

  state = {
    formattedData:null,
    error:{
      display:false,
      msg:null
    }
  }
  getUsers = async(error) =>{
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
      
      let res = await getAllUsers(localStorage.getItem("JWT"));
      if(res.error){
        await this.getUsers(res.error);
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
      title:"Number of Users:",
      data:res.users.total-1
    });
    var text = "N/A"
    if(res.users.lastUserLoggon!=null){
      text = res.users.lastUserLoggon.username;
      text = text.split('@');
      text = text[0];
    }
    data.push({
      title:"Last User Loggon:",
      data:text
    });
    data.push({
      title:"Number of administrators:",
      data:res.users.numOfAdmins-1
    });
    newState.overViewData = data;
    this.setState(newState);
  }
  setTimerForError = () =>{
    let newState = this.state;
    newState.error.display = false;
    setTimeout(() => {
      this.setState(newState);
    }, 7000)
  }
  componentDidMount(){
    this.getUsers();
  }

  render(){
    return(
      <>
        {this.state.error.display?<Alert color="danger">{this.state.error.msg}</Alert>:<Alert className="d-none" color="danger">{this.state.error.msg}</Alert>}
        <Container>
        {this.state.overViewData?
            <>
            <Overview data={this.state.overViewData} iconColor={["red","yellow","blue"]} iconName={["users","user-clock","user-md"]}/>
            </>
          :
          null}
        </Container>
      </>
    );
  }
}
  

export default ViewUsers;
