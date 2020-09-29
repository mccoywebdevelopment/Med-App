import React from 'react';

export default class SearchList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const list = () =>{
            return this.props.list.map((item,key)=>{
                return(
                    <>  
                        <span className={(key==this.state.headerSelected?'search-box-header-selected':null)} 
                            style={{marginRight:'20px',cursor:'pointer'}} onClick={()=>{this._toggleHeader(key)}}>{item.name}</span>
                    </>
                )
            });
        }
        return (
            <div className="row">
                {list()}
            </div>
        )
    }
}