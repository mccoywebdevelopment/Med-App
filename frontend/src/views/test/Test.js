import React from 'react';

import Search from '../../components/shared/Search/Search';

export default class Test extends React.Component{
    
    render(){
        let userTableHeader = ["Group Name", "# of Dependents", "# of Users", "# of Admins"];
        let userTableBody = ["Test",2,3,0];

        let userItem = {
            value:"909334234234",
            tableData:[userTableHeader,userTableBody]
        }
        let Item1 = {
            name: "User(s)",
            data: userItem
        }

        let dependentTableHeader = ["Name", "# of Meds", "is Grouped"];
        let dependentTableBody = ["Chris McCoy",2,"No"];

        let dependentItem = {
            value:"0000023322",
            tableData:[dependentTableHeader,dependentTableBody]
        }
        let Item2 = {
            name: "Dependent(s)",
            data: dependentItem
        }

        let items = [Item1,Item2];

        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                    <Search placeholder="Search & Select Item(s)" items={items} label="Items:"/>
                    </div>
                </div>
            </div>
        );
    }
}