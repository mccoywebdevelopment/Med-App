import DependentView from "./views/admin/DependentsView";
import DependentDetails from "./views/admin/DependentDetails";
import GroupView from "./views/admin/GroupView";
import Login from "./views/shared/Login";
import React from 'react';

const adminRoutes = [
    {
        path: "/admin/groups",
        component: <GroupView/>,
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
    }
]

export {adminRoutes,userRoutes,authRoutes}