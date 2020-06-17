import React from 'react';
import {Input} from 'reactstrap';
import uuid from "uuid";

import Options from './Options/Options';
import TableModel from '../TableModel/TableModel';

class ColContents extends React.Component{
    constructor(props){
        super(props);
    }
    toggleModel = () =>{

    }
    render(){
        return(
            <td>
                {/* {this.props.showInput && this.props.col.isEditable?
                    // <Input key={uuid.v4()} type={this.props.col.type} style={inputStyles} value={this.props.col.value}/>
                {this.p}
                    <TableModel isOpen={this.props.showInput}/> */}
                {this.props.col.isObject?
                    <Options key={uuid.v4()} rowIndex={this.props.rowIndex} toggleModel={this.props.toggleModel} data={this.props.col}/>
                    
                :   this.props.col.value
                }
            </td>
        )
    }
}

export default ColContents;