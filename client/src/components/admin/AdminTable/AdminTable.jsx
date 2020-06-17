import React from 'react';
import uuid from "uuid";

import {Table} from 'reactstrap'
import TableHeader from './Header/TableHeader';
import ColContents from './ColContents/ColContents';
import TableModel from '../AdminTable/TableModel/TableModel';

class AdminTable extends React.Component{
    state = {
        isHover:[]
    }
    constructor(props){
        super(props);
    }
    clickRow = (e) =>{
        if(!e.target.getAttribute('data-icon') && !e.target.getAttribute('fill') && e.target.tagName !='BUTTON'){
            this.props.viewItem(null,e.currentTarget.getAttribute('data-index'))
        }
    }
    render(){
        var data = this.props.data.tableBody;
        var numOfCols = this.props.data.tableHead.length;
        var numOfRows = data.length/numOfCols;
        
        const cols = () =>{
            var obj = [];
            var ix = 0;

            for(var i=0;i<numOfRows;++i){
                var cols = [];
                while(ix<(i+1)*numOfCols){
                    cols.push(data[ix]);
                    ix++;
                }
                obj.push(cols);
            }
            return obj;
        }
        var dataCols = cols();
        const getRow = (rowIndex) =>{
            var td = [];
            var cols = dataCols;
            for(var i=0;i<cols[rowIndex].length;++i){
                td.push(<ColContents key={uuid.v4()} col={cols[rowIndex][i]} rowIndex={rowIndex} toggleModel={this.toggleModel}/>)
            }
            return td;
        }
        const getRows = () =>{
            var rows = [];
            //e.currentTarget.getAttribute('data-index')
            for(var i=0;i<numOfRows;++i){
                rows.push(<tr key={i} data-index={i} onClick={(e)=>{this.clickRow(e)}} className='table-row-fin'>{getRow(i)}</tr>)
            }
            return rows;
        }
        return(
            <>
            <Table className='fade-in' borderless style={this.props.styles} striped>
                <TableHeader key={uuid.v4()} data={this.props.data.tableHead}/>
                <tbody>
                    {getRows()}
                </tbody>
            </Table>
            </>

        )
    }
}
export default AdminTable;