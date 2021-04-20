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
        let width = window.screen.width;
        let calc = width * .315

        let diff = selectedIndex - prevIndex;

        if(diff == -1){
            amount = -calc;
        }else if(diff == 1){
            amount = calc;
        }else if(diff == 2){
            amount = calc * 2;
        }else if(diff== -2){
            amount = calc * -2;
        }

        let icon = document.getElementById('my-icon');
        icon.style.transform = 'none';
        icon.style.transform = 'translate('+amount+'px)';
        icon.style.transition = 'all 0.4s ease-in-out';

        setTimeout(()=>{
            // let navSel = document.getElementById("navItems"+selectedIndex);
            let navs = document.getElementsByClassName('navItems');
    
            for(var i=0;i<navs.length;++i){
                let navIndex = Number(navs[i].id[navs[i].id.length-1]);
                navs[i].style.transition = 'all 0.3s ease-in-out';
                if(navIndex == selectedIndex){
                    navs[i].style.opacity = 1;
                    navs[i].style.transform = 'scale(1.25)'
                }else{
                    navs[i].style.opacity = 0.5;
                    navs[i].style.transform = 'scale(1)'
                }
            }
            // navSel.style.opacity = "1";
        },300)

    },300)
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
                    opacity:"0.5"
                }
                let colStyle = {
                    textAlign:"center"
                };
                let iconStyle = {
                    fontSize:'8px',
                    transition:"all 0.5s ease-in-out"
                }

                // if(this.props.items.indexSelected !=index){
                //     spanStyle.opacity = "0.5";
                // }
                return (
                    <div className="col-4" style={colStyle} key={"navitem324"+index}>
                        {this.props.items.prevSelected == index?
                            <>
                                <p id={"navItem"+index} className="navItems" style={spanStyle}>{item}</p>
                                <i id="my-icon" className="fas fa-circle" style={iconStyle}></i>
                            </>
                        :
                            <p id={"navItem"+index} className="navItems" style={spanStyle}>{item}</p>
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