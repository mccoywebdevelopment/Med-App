import React from 'react';
import {Container} from 'reactstrap';
import UserDashBoard from '../../components/user/UserDashboard/UserDashboard';
class UserMedTable extends React.Component{
    render(){
        return(
            <>
                <Container>
                    <UserDashBoard/>
                </Container>
            </>
        )
    }
}
export default UserMedTable;