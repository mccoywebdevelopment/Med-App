import React from 'react';

import SearchList from './SearchList';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this._init();
        this._toggleHeader = this._toggleHeader.bind(this);
    }
    _init = () =>{
        this.state = {
            headerSelected:0
        }
    }
    _toggleHeader = (index) =>{
        this.setState({headerSelected:index});
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
                    <input type="text" class="form-control" name="groups32" placeholder={this.props.placeholder}/>
                    <div class="invalid-feedback" style={{display: 'block'}}>&nbsp;</div>
                </div>
            </div>
            {itemHeaders()}
            <SearchList color={this.props.color} itemObj={this.props.items[this.state.headerSelected].data}/>
            </>
        )
    }
}