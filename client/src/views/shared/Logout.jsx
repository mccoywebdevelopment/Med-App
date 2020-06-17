import React from 'react';
import {Redirect} from 'react-router';
import {logout} from "../../api/auth/auth";

class Logout extends React.Component{
    state = {
        isRedirect:null,
    }
    constructor(props){
        super(props);
        var jwt = localStorage.getItem("JWT");
        logout(jwt,(res)=>{
            if(res.error){
                alert(res.error);
            }else{
                let newState = this.state;
                newState.isRedirect = true;
                this.setState(newState);
            }
        });
    }
    render(){
        return(<>
            {this.state.isRedirect?
                <Redirect to="/login"/>
            :null}
        </>);
    }
}
export default Logout;