import React from 'react';

export default class Search extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="form-group">
              <input type="search" class="form-control" placeholder="Search Here"/>
            </div>
        )
    }
}