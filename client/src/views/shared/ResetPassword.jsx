import React from 'react';
import {emailValidator,passwordValidator} from "../../config/validator";
import PassStrength from "./PassStrength";
import zxcvbn from 'zxcvbn';
import {login,resetPassword} from '../../api/auth/auth';
import {Redirect} from 'react-router';
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    Label,
    CardBody,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    FormFeedback
  } from "reactstrap";

class ResetPassword extends React.Component{
    constructor(props){
      super(props);
    }
    state = {
        email:"",
        password:"",
        passwordErrorMsg:"",
        isRedirect:null
        }
        changeHandler = (e,isEmail) =>{
        let newState = this.state;
        if(isEmail){
            newState.email = e.target.value
        }else{
            this.passwordChangeHandler(e);
        }
        this.setState(newState);
        }
        passwordChangeHandler=(e)=>{
          let newState = this.state;
          newState.password = e.target.value;
          newState.passwordScore = zxcvbn(e.target.value).score;
          this.setState(newState)
        }
        submitHandler = () =>{
  
        let newState = this.state;
        var isValid = true;
        newState.emailErrorMsg = emailValidator(newState.email,true).errorMsg;
        newState.passwordErrorMsg = passwordValidator(newState.password,true).errorMsg;
        if(newState.passwordErrorMsg.length>0){
            isValid = false;
        }
        this.setState(newState);
        
        if(isValid){
            var bodyData ={
              email:this.props.match.params.email,
              password:this.state.password,
              JWT:this.props.match.params.token
            }
            resetPassword(bodyData,(res)=>{
            if(res.error){
                alert(res.error);
            }else{
                let newState = this.state;
                var redirectURL = res.result.redirectURL;
                localStorage.setItem("JWT",res.result.JWT);
                newState.isRedirect = redirectURL;
                this.setState(newState);
            }
            });
        }
        
        }
    render(){
        return(<>
                      {this.state.isRedirect? <Redirect to={this.state.isRedirect}/>:
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Enter your new password:</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                    <Label>Email</Label>
                    <Input style={{color:'black'}} placeholder="Email" value={this.props.match.params.email} type="email" disabled/>
                </FormGroup>
                <FormGroup>
              
                    {this.state.passwordErrorMsg.length>0?
                    <>
                    <Label>Password</Label>
                    <Input  style={{color:'black'}} placeholder="Password" onChange={(e)=>{this.changeHandler(e,false)}} type="password" invalid />
                    <FormFeedback>{this.state.passwordErrorMsg}</FormFeedback>
                    </>
                    :
                    <>
                    <Label>Password</Label>
                    <Input style={{color:'black'}} placeholder="Password" onChange={(e)=>{this.changeHandler(e,false)}} type="password"/>
                    </>
                    }
                    <PassStrength passwordScore={this.state.passwordScore}/>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={this.submitHandler}>
                    Reset Password
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>}
        </>);
    }
}
export default ResetPassword;