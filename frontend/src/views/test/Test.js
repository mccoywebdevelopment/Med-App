import React from 'react';

import Search from '../../components/shared/Search/Search';
import CreateGroup from '../../components/admin/forms/group/CreateGroup';
import Calendar from "../../components/shared/Calendar/Calendar";

export default class Test extends React.Component{
    
    render(){
        let userTableHeader = [{value:"Name",colSpan:2},{value:"#Dependents",colSpan:1},{value:"#Users",colSpan:1},{value:"#Admins",colSpan:1}];
        let userTableBody = [
                        "Test",2,3,0,
                        "McCoy House",1,1,1,
                        "Bob House",1,1,1,
                        "Dan House",1,1,1
                    ];

        let userItems = {
            values:["909334234234","8098092","32","kljl"],
            selectedValues:["8098092"],
            hiddenValues:[],
            tableData:[userTableHeader,userTableBody]
        }
        let Item1 = {
            name: "User(s)",
            data: userItems
        }

        let dependentTableHeader = [{value:"Name",colSpan:2},{value:"#Meds",colSpan:1},{value:"is Grouped",colSpan:1}];
        let dependentTableBody = ["Chris McCoy",2,"No","Chan Mung",2,"Yes"];

        let dependentItems = {
            values:["909334234234","8098092"],
            selectedValues:["8098092"],
            hiddenValues:[],
            tableData:[dependentTableHeader,dependentTableBody]
        }
        let Item2 = {
            name: "Dependent(s)",
            data: dependentItems
        }

        let items = [Item1,Item2];

        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        {/* <Search color={"#8862e0"} placeholder="Search & Select Item(s)" items={items} label="Items:"/> */}
                        {/* <CreateGroup/> */}
                        <Calendar events={[]}/>
                    </div>
                </div>
            </div>
        );
    }
}