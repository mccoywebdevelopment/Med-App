import React from 'react';
import { FormGroup, Label, Input, FormText} from 'reactstrap';

export default class DynamicInput extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var value = this.props.value;
        if(this.props.type=='date' && this.props.isInput){
            var d = value;
            var date= d.split("-");
            var mm = date[0];
            var dd = date[1];
            var yyyy = date[2];
            value = yyyy+'-'+mm+'-'+dd;
        }
        return(
            <>
            {this.props.isInput?
                <FormGroup>
                    <Label for={this.props.id}>{this.props.label}</Label>
                    <Input type={this.props.type} name={this.props.name} onChange={this.props.onChange} value={value} id={this.props.id} placeholder={this.props.placeholder} required={this.props.isRequired}/>
                </FormGroup>
            :<p style={{borderBottom:'1px solid #DEE2E6'}}>{this.props.label}:<span style={{float:'right'}}>{this.props.value}</span></p>
            }
            </>
        )
    }
}