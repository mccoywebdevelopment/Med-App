import React from 'react';

class PassStrength extends React.Component{
    constructor(props){
        super(props);
    }
    createPasswordLabel = (result) => {
        var obj = {
            color:"text-danger",
            label:'Weak'
        }
        if(result==2){
            obj.color = "text-warning";
            obj.label = 'Fair'
        }else if(result==3){
            obj.color = "text-success";
            obj.label = 'Good'
        }else if(result==4){
            obj.color = "text-success";
            obj.label = 'Strong'
        }
        return obj;
      }
    render(){
        return(
            <>
                <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className={this.createPasswordLabel(this.props.passwordScore).color+" font-weight-700"}><strong>{this.createPasswordLabel(this.props.passwordScore).label}</strong></span>
                  </small>
                </div>
            </>
        );
    }
}
export default PassStrength;