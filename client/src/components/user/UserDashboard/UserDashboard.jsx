import React from 'react';
import {getAllDependentsFromCurGroup} from "../../../api/users/Users";
import {Container,Alert} from "reactstrap";

class UserDashboard extends React.Component{
    state={
        formattedData:null,
        error:{
            display:false,
            msg:null
          }
    }
    getDepsWithMeds = async(error) =>{
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
            var jwt = localStorage.getItem("JWT");
            let res = await getAllDependentsFromCurGroup(jwt);
            if(res.error){
                 await this.getDepsWithMeds(res.error);
            }else{
                this.setState(newState);
                return true;
            }
        }
    }
    setTimerForError = () =>{
        let newState = this.state;
        newState.error.display = false;
        setTimeout(() => {
          this.setState(newState);
        }, 7000)
      }
    componentDidMount(){
        this.getDepsWithMeds(); 
    }
    render(){
        return(
            <>
                {this.state.error.display?<Alert color="danger">{this.state.error.msg}</Alert>:<Alert className="d-none" color="danger">{this.state.error.msg}</Alert>}
                <Container>
                    {/* {this.state.formattedData?<UserTable getAddPopUpData={getPopUpForTookToday} isUser={true} hasInnerTable={true} updateData={this.getDepsWithMeds} data={this.state.formattedData}/>:null} */}
                </Container>
            </>
        )
    }
}

export default UserDashboard;