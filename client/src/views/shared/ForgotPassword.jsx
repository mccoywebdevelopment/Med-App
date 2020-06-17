import React from 'react';
import {emailValidator,passwordValidator} from "../../config/validator";
import {login} from '../../api/auth/auth';
import {Redirect} from 'react-router';
import {sendForgotPasswordEmail} from '../../api/email/email'
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

class ForgotPassword extends React.Component{

    state = {
        email:"",
        emailErrorMsg:"",
        isRedirect:null
        }
        changeHandler = (e,isEmail) =>{
        let newState = this.state;
        if(isEmail){
            newState.email = e.target.value
        }else{
            newState.password = e.target.value;
        }
        this.setState(newState);
        }
        submitHandler = () =>{
        let newState = this.state;
        var isValid = true;
        newState.emailErrorMsg = emailValidator(newState.email,true).errorMsg;
        if(newState.emailErrorMsg.length>0){
            isValid = false;
        }
        this.setState(newState);
        
        if(isValid){
            sendForgotPasswordEmail(this.state.email,(res)=>{
            if(res.error){
                alert(res.error);
            }else{
                let newState = this.state;
                var redirectURL = res.result.redirectURL;
                newState.isRedirect = redirectURL;
                alert(res.result);
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
                <small>Enter your email associated with application:</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
          
                    {this.state.emailErrorMsg.length>0?
                    <>
                    <Label>Email</Label>
                    <Input  style={{color:'black'}} placeholder="Email" onChange={(e)=>{this.changeHandler(e,true)}} type="email" invalid />
                    <FormFeedback>{this.state.emailErrorMsg}</FormFeedback>
                    </>
                    :
                    <>
                    <Label>Email</Label>
                    <Input style={{color:'black'}} placeholder="Email" onChange={(e)=>{this.changeHandler(e,true)}} type="email"/>
                    </>
                    }
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={this.submitHandler}>
                    Send Email
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="/auth/login"
              >
                <small>Login</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
              </a>
            </Col>
          </Row>
        </Col>}
        </>);
    }
}
export default ForgotPassword;