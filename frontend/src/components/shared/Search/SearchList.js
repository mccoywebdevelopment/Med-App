import { initial } from 'lodash';
import React from 'react';

export default class SearchList extends React.Component {
    constructor(props) {
        super(props);
        this._init();
    }
    _init = () => {
        this.state = {
            selected: []
        }
    }
    _toggleAll = (e) => {
        let newState = this.state;
        let values = JSON.parse(JSON.stringify(this.props.itemObj.values));
        if(e){
            let index = e.target.id;
            let item = values[index]
            if(newState.selected.includes(item)){
                const index = newState.selected.indexOf(item);
                if (index > -1) {
                    newState.selected.splice(index, 1);
                }
            }else{
                newState.selected.push(item);
            }
        }
        else if(newState.selected.length>0){
            newState.selected = []
        }else{
            newState.selected = values;
        }
        this.setState(newState);
        console.log(this.state);
        console.log(this.props)
    }
    componentWillReceiveProps = (newProps) => {
        if (this.props != newProps) {
            this._init();
        }
    }
    render() {
        const checkBoxStyle = {
            color:this.props.color,
            marginLeft:'0px',
            transform: "scale(1.5)"
        }
        const header = () => {
            return this.props.itemObj.tableData[0].map((item, key) => {
                return (
                    <th scope="col" colSpan={item.colSpan} key={'header' + key}>{item.value}</th>
                )
            });
        }

        const body = (list) => {
            return list.map((item, key) => {
                return (
                    <td colSpan={this.props.itemObj.tableData[0][key].colSpan}>{item}</td>
                )
            });
        }
        const rows = () => {
            let rowLen = this.props.itemObj.tableData[1].length / this.props.itemObj.tableData[0].length;
            let rows = [];

            for (var i = 0; i < rowLen; ++i) {
                let list = JSON.parse(JSON.stringify(this.props.itemObj.tableData[1]));
                let itemLen = list.length / rowLen;
                let start = i * itemLen;
                let end = start + itemLen;
                let key = this.props.itemObj.values[i];

                list = list.splice(start, end);
                rows.push(
                    <tr key={"row" + i}>
                        <td>{this.state.selected.includes(key)?
                            <i id={i} style={checkBoxStyle} class="far fa-check-square" onClick={this._toggleAll}></i>
                            :
                            <i id={i} style={checkBoxStyle} class="far fa-square" onClick={this._toggleAll}></i> 
                            }
                        </td>
                        {body(list)}
                    </tr>
                );
            }
            return rows;
        }

        return (
            <>
                {this.props.itemObj.tableData[1].length > 0 ?
                    <table className="table dependentTable my-search-table" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>
                                    {this.state.selected.length == this.props.itemObj.values.length ?
                                        <i style={checkBoxStyle} class="far fa-check-square" onClick={()=>this._toggleAll()}></i>
                                        :
                                        <i style={checkBoxStyle} class="far fa-square" onClick={()=>this._toggleAll()}></i>
                                    }
                                </th>
                                {header()}
                            </tr>
                        </thead>
                        <tbody>
                            {rows()}
                            {/* {list(this.props.users)} */}
                        </tbody>
                    </table>
                    : null}
            </>
        )
    }
}