import React from 'react'

export default class GroupNav extends React.Component {
    constructor(props) {
        super(props);
    }
    /*
    name,
    id
    
    also need a filter handler
    */
   _scrollIntoView = (id) =>{
       let ele = document.getElementById(id);
       ele.scrollIntoView({
        behavior: 'auto',
            block: 'center',
            inline: 'center',
            behavior:'smooth'
       });
   }
    render() {

        const list = () => {
            return this.props.items.map((item, index) => {
                return (
                    <button id={"groupNav"+index} onClick={() => { this.props.filter(item.id);this._scrollIntoView("groupNav"+index)}} type="button"
                    className={"btn " + (item.isSelected ? "btn-primary" : "btn-outline-secondary")} style={{ fontSize: '0.8em' }}>{item.title}</button>
                )
            });
        }
        return (
            <>
                {this.props.items.length > 0 ?
                    <div className="col-lg-12" style={{textAlign:'center',marginBottom:'2em',overflow:'scroll'}}>
                        
                         <div className="btn-group" role="group" aria-label="Basic example">
                        {list()}
                        </div>
                    </div>
                    : null}
            </>
        )
    }
}