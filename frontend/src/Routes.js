import DependentView from "./views/admin/DependentView";
import DependentOverview from "./views/admin/DependentOverview";
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
        component: <DependentView children={<DependentOverview/>}/>
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