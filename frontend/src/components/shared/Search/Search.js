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
    _init = () => {
        this.state = {
            headerSelected: 0,
            items: JSON.parse(JSON.stringify(this.props.items)),
            searchValue: ""
        }
    }
    _toggleHeader = (index) => {
        this.setState({ headerSelected: index });
    }
    _updateSearchValue = (e) => {
        let newState = this.state;
        newState.searchValue = e.target.value;
        this.setState(newState);
        this._updateList();
    }
    _updateList = () => {
        let newState = this.state;
        for (var i = 0; i < newState.items.length; ++i) {
            let tableDataBody = newState.items[i].data.tableData[1];
            let hiddenValues = newState.items[i].data.hiddenValues;
            let selectedValues = newState.items[i].data.selectedValues;
            let values = newState.items[i].data.values;
            let colLen = newState.items[i].data.tableData[0].length;
            let lastRowNum = -1;

            for (var ix = 0; ix < tableDataBody.length; ++ix) {
                let rowNum = ~~(ix / colLen);
                if (this.state.searchValue == "" ||
                    tableDataBody[ix].toString().toLowerCase().includes(this.state.searchValue.toLowerCase())) {
                    if (hiddenValues.includes(values[rowNum])) {
                        hiddenValues.splice(hiddenValues.indexOf(values[rowNum]));
                    }
                    lastRowNum = rowNum;
                } else if (lastRowNum != rowNum && !hiddenValues.includes(values[rowNum]) && !selectedValues.includes(values[rowNum])) {
                    hiddenValues.push(values[rowNum]);
                }
            }
        }
        this.setState(newState);
    }
    _getSelectedValues = ()=>{
        let values = [];
        for(var i=0;i<this.state.items.length;++i){
            values.push(this.state.items[i].data.selectedValues);
        }
        return values;
    }
    _toggleAll = (e) => {
        let newState = this.state;
        let values = newState.items[this.state.headerSelected].data.values;
        let hiddenValues = newState.items[this.state.headerSelected].data.hiddenValues;
        if (e) {
            let index = e.target.id;
            let item = values[index]
            if (newState.items[this.state.headerSelected].data.selectedValues.includes(item)) {
                const index = newState.items[this.state.headerSelected].data.selectedValues.indexOf(item);
                if (index > -1) {
                    newState.items[this.state.headerSelected].data.selectedValues.splice(index, 1);
                }
            }else if(this.props.isSingleSelect){
                newState.items[this.state.headerSelected].data.selectedValues = [];
                newState.items[this.state.headerSelected].data.selectedValues.push(item);
            }else {
                newState.items[this.state.headerSelected].data.selectedValues.push(item);
            }
        }
        else if (newState.items[this.state.headerSelected].data.selectedValues.length > 0) {
            newState.items[this.state.headerSelected].data.selectedValues = []
        } else {
            newState.items[this.state.headerSelected].data.selectedValues = [];
            for (var i = 0; i < values.length; ++i) {
                if (!hiddenValues.includes(values[i])) {
                    newState.items[this.state.headerSelected].data.selectedValues.push(values[i]);
                }
            }
        }
        this.setState(newState);

        if(this.props.updateParentState){
            this.props.updateParentState(this.state.items[this.props.dataSel].data.selectedValues);
        }
        if(this.props.updateParentStateAll){
            this.props.updateParentStateAll(this._getSelectedValues());
        }
    }
    render() {
        let headerStyle = {
            borderColor: this.props.color,
            marginRight: '20px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '3px'
        }
        const itemHeaders = () => {
            return this.props.items.map((item, key) => {
                return (
                    <span key={'header8329' + key} className={(key == this.state.headerSelected ? 'search-box-header-selected' : null)}
                        style={headerStyle}
                        onClick={() => { this._toggleHeader(key) }}>{item.name + " (" + this.state.items[key].data.selectedValues.length + ")"}</span>
                )
            });
        }
        return (
            <>
                {this.props.items.length > 0 ?
                    <>
                        <div className="form-group" style={{ marginBottom: '0px' }}>
                            {this.props.label ? <label className="label">{this.props.label}</label> : null}
                            <div className="input-group">
                                <input onChange={this._updateSearchValue} value={this.state.searchValue}
                                    type="text" className="form-control" name="groups32" placeholder={this.props.placeholder} />
                                <div className="invalid-feedback" style={{ display: 'block' }}>&nbsp;</div>
                            </div>
                        </div>
                        <>
                            {itemHeaders()}
                            {this.state.items[this.state.headerSelected] ?
                                <SearchList isSingleSelect={this.props.isSingleSelect} isReadOnly={this.props.isReadOnly} color={this.props.color} itemObj={this.state.items[this.state.headerSelected].data}
                                    toggleAll={this._toggleAll} />
                                : null}
                        </>
                    </>
                    : null}
            </>
        )
    }
}