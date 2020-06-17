import React from 'react';
import uuid from "uuid";

class TableHeader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const list = () =>{
            var list = []
            for(var i=0;i<this.props.data.length;++i){
                list.push(<th key={uuid.v4()}>{this.props.data[i]}</th>)
            }
            return list;
        }
        return(
            <thead>
                    <tr>
                        {list()}
                    </tr>
            </thead>
        )
    }
}
export default TableHeader;