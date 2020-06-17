import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faArrowAltCircleLeft, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {DropdownToggle, DropdownMenu, Button, DropdownItem, UncontrolledDropdown,
    Dropdown, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uuid from "uuid";

export default class ItemOptions extends React.Component{
    state = {
        isOpen:false
    }
    constructor(props){
        super(props);
        console.log(this.props);
    }
    toggle = () =>{
        let newState = this.state;
        newState.isOpen = !newState.isOpen;
        this.setState(newState);
    }
    render(){
        const listOfTopItems = () =>{
            return this.props.data.map((item)=>{
                return(
                    <React.Fragment key={uuid.v4()}>
                        {!item.isDelete?
                            <DropdownItem key={uuid.v4()} style={{color:'black'}} onClick={item.toggle.bind(null,item.data)}>{item.value}</DropdownItem>
                        :
                            <DropdownItem key={uuid.v4()} style={{color:'red'}} onClick={item.toggle.bind(null,item.data)}>{item.value}</DropdownItem>
                        }
                    </React.Fragment>
                );
            });
        }
        // const listOfBottomItems = () =>{
        //     const length = this.props.bottom.length;
        //     return this.props.bottom.map((item,key)=>{
        //         var style = {
        //             color:'black'
        //         }
        //         if(key==length-1){
        //             style.color = 'red';
        //         }
        //         return(
        //             <React.Fragment key={uuid.v4()}>
        //                 {!item.disabled && item.toggle?
        //                     <DropdownItem key={uuid.v4()} onClick={item.toggle.bind(null,item.data)} style={style}>{item.value}</DropdownItem>
        //                 :
        //                 <DropdownItem key={uuid.v4()} disabled>{item.value}</DropdownItem>
        //                 }
        //             </React.Fragment>
        //         );
        //     });
        // }
        return(
            <>
                <a className={'nav-link ml-auto'} style={this.props.style}>

                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} className='table-options'>
                    <DropdownToggle tag="span" aria-expanded={this.state.isOpen} style={{cursor:'pointer'}}>
                        {/* <a className={'nav-link ml-auto'}> <FontAwesomeIcon icon={faEllipsisV}/></a> */}
                        <FontAwesomeIcon style={{fontSize:this.props.size}} icon={faEllipsisV}/>
                        <DropdownMenu key={uuid.v4()}>
                                {listOfTopItems()}
                        </DropdownMenu>
                    </DropdownToggle>
                </Dropdown>
                </a>
            </>
        )
        // return(
        //     <a className={'nav-link ml-auto'}> <FontAwesomeIcon icon={faEllipsisV}/></a>
        // );
    }
}