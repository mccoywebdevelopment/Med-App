import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

class Expand extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
                <div className="my-expand" onClick={this.props.expandHandler.bind(this,this.props.day)}>
                    +{this.props.length-1} more <FontAwesomeIcon icon={faCaretDown} size={'1x'}/>
                </div>
            </>
        )
    }
}
export default Expand;