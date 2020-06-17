import React from 'react';
import MultiSelect from "@khanacademy/react-multi-select";

class MultiSelectPopUp extends React.Component{
    constructor(props){
        super(props);
        this.state.selected = this.props.selected;
        this.sendDataTOParent();
    }
    sendDataTOParent = () =>{
        this.props.multiSelectSubmitCallback(this.state.selected,this.props.req,this.props.path);
    }
    state={
        selected:[]
    }
    render(){
        return(
            <>
                <MultiSelect style={{width:'100%'}}
                options={this.props.options}
                selected={this.state.selected}
                onSelectedChanged={selected => {
                    let newState = this.state;
                    newState.selected = selected;
                    this.sendDataTOParent();
                    this.setState(newState)}}/>
            </>
        )
    }
}
export default MultiSelectPopUp;