import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
export default class TableModel extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Modal isOpen={this.props.isOpen}>
                {/* <ModalHeader toggle={this.props.toggle}>{this.props.modelTitle}</ModalHeader>
                <ModalBody>
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-primary" color="primary" outline onClick={this.props.toggle}>{this.props.button1.text}</Button>
                    <Button className="btn-primary" color="primary" onClick={this.props.button2.toggle}>{this.props.button2.text}</Button>
                </ModalFooter> */}
                <ModalHeader toggle={this.props.toggle}>{this.props.modelTitle}</ModalHeader>
                {this.props.children}
            </Modal>
        );
    }
}