import React from 'react';
import {DropdownToggle, DropdownMenu, Button, DropdownItem, UncontrolledDropdown,
     Dropdown, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import uuid from "uuid";

class Options extends React.Component{
    state = {
        isOpen:false
    }
    constructor(props){
        super(props);
    }
    toggle = () =>{
        let newState = this.state;
        newState.isOpen = !newState.isOpen;
        this.setState(newState);
    }
    render(){
        const listOfTopItems = () =>{
            return this.props.data.isObject.top.map((item)=>{
                return(
                    <React.Fragment key={uuid.v4()}>
                        {!item.disabled && item.toggle?
                            <DropdownItem key={uuid.v4()} onClick={item.toggle.bind(null,item.data)}>{item.value}</DropdownItem>
                        :
                            <DropdownItem key={uuid.v4()} disabled>{item.value}</DropdownItem>
                        }
                    </React.Fragment>
                );
            });
        }
        const listOfBottomItems = () =>{
            const length = this.props.data.isObject.bottom.length;
            return this.props.data.isObject.bottom.map((item,key)=>{
                var style = {
                    color:'black'
                }
                if(key==length-1){
                    style.color = 'red';
                }
                return(
                    <React.Fragment key={uuid.v4()}>
                        {!item.disabled && item.toggle?
                            <DropdownItem key={uuid.v4()} onClick={item.toggle.bind(null,item.data)} style={style}>{item.value}</DropdownItem>
                        :
                        <DropdownItem key={uuid.v4()} disabled>{item.value}</DropdownItem>
                        }
                    </React.Fragment>
                );
            });
        }
        return(
            <>

                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} className='table-options'>
                    <DropdownToggle tag="span" aria-expanded={this.state.isOpen} style={{cursor:'pointer'}}>
                        <FontAwesomeIcon icon={faEllipsisH}/>
                        <DropdownMenu key={uuid.v4()}>
                                {listOfTopItems()}
                                <DropdownItem divider />
                                {listOfBottomItems()}
                        </DropdownMenu>
                    </DropdownToggle>
                </Dropdown>
            </>
        )
    }
}

export default Options;