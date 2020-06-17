import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {Table, DropdownToggle, DropdownMenu, Button, DropdownItem,
     Dropdown, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class DependentTable extends React.Component{
    state ={
        isOpen:false,
        modelIsOpen:false
    }
    toggle = () =>{
        let newState = this.state;
        newState.isOpen = !newState.isOpen;
        this.setState(newState);
    }
    toggleModel = () =>{
        let newState = this.state;
        newState.modelIsOpen = !newState.modelIsOpen;
        this.setState(newState);
    }
    render(){
        const row = () =>{
            return(
                <tr>
                    <th scope="row">1</th>
                    <td>Christopher</td>
                    <td>McCoy</td>
                    <td>12/17/1996</td>
                    <td>3</td>
                    <td>0</td>
                    <td>
                    <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                        <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.isOpen} style={{cursor:'pointer'}}>
                        <FontAwesomeIcon icon={faEllipsisH}/>
                            <DropdownMenu>
                            <DropdownItem header style={{color:'black'}}>List of Actions:</DropdownItem>
                                 <DropdownItem disabled>View OTC</DropdownItem>
                                 <DropdownItem onClick={this.toggleModel}>View RXS</DropdownItem>
                                 <DropdownItem divider />
                                 <DropdownItem>Edit Dependent</DropdownItem>
                                 <DropdownItem style={{color:'red'}}>Delete Dependent</DropdownItem>
                            </DropdownMenu>
                        </DropdownToggle>
                    </Dropdown>
                    </td>
                </tr>
            )
        }
        const list = () =>{
            var list = [];
            for(var i=0;i<1;++i){
                list.push(row());
            }
            return list;
        }
        return(
            <>
            <Modal isOpen={this.state.modelIsOpen} toggle={this.toggleModel} style={{width:'100%'}} size="lg">
                <ModalHeader toggle={this.toggleModel}>Modal title</ModalHeader>
                <ModalBody>
                <Table borderless>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th># of Rxs</th>
                        <th># of OTC</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary">Do Something</Button>{' '}
                    <Button color="secondary">Cancel</Button>
                </ModalFooter>
            </Modal>
            <Table borderless>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th># of Rxs</th>
                        <th># of OTC</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {list()}
                </tbody>
            </Table>
            </>
        )
    }
}

export default DependentTable;