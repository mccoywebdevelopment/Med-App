import React from 'react';
import ReactSearchBox from 'react-search-box'

export default class SearchBox extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <ReactSearchBox
                placeholder={this.props.placeholder}
                data={this.props.data}
                onSelect={record => this.props._setGroupInput(null,record.value,record.key)}
                fuseConfigs={{
                    threshold: 0.05,
                }}
            />
        )
    }
}