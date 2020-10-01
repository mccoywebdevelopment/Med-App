import { set } from 'lodash';
import React from 'react';

import SearchList from './SearchList';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this._init();
        this._toggleHeader = this._toggleHeader.bind(this);
        this._toggleAll = this._toggleAll.bind(this);
    }
    _init = () =>{
        this.state = {
            headerSelected:0,
            items:JSON.parse(JSON.stringify(this.props.items)),
            searchValue:""
        }
    }
    _toggleHeader = (index) =>{
        this.setState({headerSelected:index});
    }
    _updateSearchValue = (e) =>{
        let newState = this.state;
        newState.searchValue = e.target.value;
        this.setState(newState);
        this._updateList();
    }
    _updateList = () =>{
        let newState = this.state;
        // newState.items = JSON.parse(JSON.stringify(newState.items));
        for(var i=0;i<newState.items.length;++i){
            let tableDataBody = newState.items[i].data.tableData[1];
            let hiddenValues = newState.items[i].data.hiddenValues;
            let selectedValues = newState.items[i].data.selectedValues;
            let values = newState.items[i].data.values;
            let colLen = newState.items[i].data.tableData[0].length;
            let lastRowNum = -1;

            for(var ix=0;ix<tableDataBody.length;++ix){
                let rowNum = ~~(ix/colLen);
                // console.log(tableDataBody[ix].toString().toLowerCase())
                // console.log(this.state.searchValue.toLowerCase())
                // console.log(tableDataBody[ix].toString().toLowerCase().includes(this.state.searchValue.toLowerCase()))
                // console.log(rowNum)
                // console.log(lastRowNum);
                // console.log("====================================================")
                if( this.state.searchValue=="" || 
                    tableDataBody[ix].toString().toLowerCase().includes(this.state.searchValue.toLowerCase())){
                    if(hiddenValues.includes(values[rowNum])){
                        hiddenValues.splice(hiddenValues.indexOf(values[rowNum]));
                    }
                    lastRowNum = rowNum;
                    // alert(true)
                }else if(lastRowNum != rowNum && !hiddenValues.includes(values[rowNum]) && !selectedValues.includes(values[rowNum])){
                    hiddenValues.push(values[rowNum]);
                }
            }
        }
        console.log(newState)
        this.setState(newState);
    }
    _toggleAll = (e) => {
        let newState = this.state;
        let values = JSON.parse(JSON.stringify(newState.items[this.state.headerSelected].data.values));
        if(e){
            let index = e.target.id;
            let item = values[index]
            if(newState.items[this.state.headerSelected].data.selectedValues.includes(item)){
                const index = newState.items[this.state.headerSelected].data.selectedValues.indexOf(item);
                if (index > -1) {
                    newState.items[this.state.headerSelected].data.selectedValues.splice(index, 1);
                }
            }else{
                newState.items[this.state.headerSelected].data.selectedValues.push(item);
            }
        }
        else if(newState.items[this.state.headerSelected].data.selectedValues.length>0){
            newState.items[this.state.headerSelected].data.selectedValues = []
        }else{
            newState.items[this.state.headerSelected].data.selectedValues = values;
        }
        this.setState(newState);
    }
    render() {
        let headerStyle = {
            borderColor:this.props.color,
            marginRight:'20px',
            cursor:'pointer',
            fontSize: '0.875rem',
            padding:'3px'
        }
        const itemHeaders = () =>{
            return this.props.items.map((item,key)=>{
                return(
                    <>  
                        <span className={(key==this.state.headerSelected?'search-box-header-selected':null)} 
                            style={headerStyle} onClick={()=>{this._toggleHeader(key)}}>{item.name}</span>
                    </>
                )
            });
        }
        return (
            <>
            <div class="form-group" style={{marginBottom:'0px'}}>
                <label class="label">{this.props.label}</label>
                <div class="input-group">
                    <input onChange={this._updateSearchValue} value={this.state.searchValue} 
                        type="text" class="form-control" name="groups32" placeholder={this.props.placeholder}/>
                    <div class="invalid-feedback" style={{display: 'block'}}>&nbsp;</div>
                </div>
            </div>
            {itemHeaders()}
            {this.state.items[this.state.headerSelected]?
            <SearchList color={this.props.color} itemObj={this.state.items[this.state.headerSelected].data}
                toggleAll={this._toggleAll}/>
            :null}
            </>
        )
    }
}