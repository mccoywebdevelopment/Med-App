import DependentView from "./views/admin/DependentsView";
import DependentDetails from "./views/admin/DependentDetails";
import GroupView from "./views/admin/GroupView";
import UserView from "./views/admin/UserView";
import Login from "./views/shared/Login";
import Register from './views/shared/Register';
import React from 'react';

const adminRoutes = [
    {
        path: "/admin/groups",
        component: <GroupView/>,
    },
    {
        path: "/admin/users",
        component: <UserView/>,
    },
    {
        path: "/admin/dependents",
        component: <DependentView/>,
    },
    {
        path: "/admin/dependents/:id",
        component: <DependentDetails/>
    }
];

const userRoutes = [
    {
        path:'/user/dependents'
    }
];

const authRoutes = [
    {
        path: "/auth/login",
        component: <Login/>
    },
    {
        path: "/auth/reset-password/:email/:token",
        component: <Register/>
    }
]

export {adminRoutes,userRoutes,authRoutes}