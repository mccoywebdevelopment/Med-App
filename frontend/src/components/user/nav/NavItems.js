import React from 'react'

export default class NavItems extends React.Component{
    constructor(props){
        super(props);
    }
    _myAnimation = () =>{
        setTimeout(()=>{
        let selectedIndex = this.props.items.indexSelected;
        let prevIndex = this.props.items.prevSelected;
        let amount = 0;

        let diff = selectedIndex - prevIndex;

        if(diff == -1){
            amount = -14;
        }else if(diff == 1){
            amount = 14;
        }else if(diff == 2){
            amount = 28;
        }else if(diff== -2){
            amount = -28;
        }
        console.log(amount)

        let icon = document.getElementById('my-icon');
        icon.style.transform = 'none';
        icon.style.transform = 'translate('+amount+'em)';
        icon.style.transition = 'all 0.5s ease-in-out'

        console.log(icon)

        // setTimeout(()=>{
        //     icon.style.transform = 'translate('+amount+'em)';
        //     console.log(icon)
        // },2000)
    },500)
    }
    componentDidMount = () =>{
        this._myAnimation();
    }
    componentWillReceiveProps = () =>{
        this._myAnimation();
    }
    render(){

        const list = () =>{
            return this.props.items.names.map((item,index)=>{
                let spanStyle = {
                    fontWeight:'bold',
                    marginBottom:'-8px',
                }
                let colStyle = {
                    textAlign:"center"
                };
                let iconStyle = {
                    fontSize:'8px',
                    transition:"all 0.5s ease-in-out"
                }

                if(this.props.items.indexSelected !=index){
                    spanStyle.opacity = "0.5";
                }

                return (
                    <div className="col-4" style={colStyle} key={"navitem324"+index}>
                        {this.props.items.prevSelected == index?
                            <>
                                <p onClick={()=>{this.props.toggle(index)}} style={spanStyle}>{item}</p>
                                <i id="my-icon" className="fas fa-circle" style={iconStyle}></i>
                            </>
                        :
                        <span onClick={()=>{this.props.toggle(index)}} style={spanStyle}>{item}</span>
                         }
                    </div>
                )
            });
        }
        return(
            list()
        )
    }
}