import React from 'react';
import { ModalBody, ModalFooter, Button } from 'reactstrap';

export default class DeleteDependent extends React.Component{
    constructor(props){
        super(props);
    }
    handleDelete = () =>{
        this.props.delete(this.props.obj);
    }
    render(){

        return(
            <>
                <ModalBody>
                <p>{this.props.text}</p>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-primary" color="primary" onClick={this.props.toggleTable} outline>Cancel</Button>
                    <Button className="btn-primary" color="primary" onClick={this.handleDelete}>Delete</Button>
                </ModalFooter>
            </>
        )
    }
}