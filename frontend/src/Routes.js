import React from 'react';

import DependentView from "./views/admin/DependentsView";
import DependentDetails from "./views/admin/DependentDetails";
import GroupView from "./views/admin/GroupView";
import UserView from "./views/admin/UserView";
import UserDetails from "./views/admin/UserDetails";
import ForgotPassword from "./views/shared/ForgotPassword";
import ResetPassword from "./views/shared/ResetPassword";
import Login from "./views/shared/Login";
import Register from './views/shared/Register';

import Test from './views/test/Test';

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
        path: "/admin/users/:id",
        component: <UserDetails/>
    },
    {
        path: "/admin/dependents",
        component: <DependentView/>,
    },
    {
        path: "/admin/dependents/:id",
        component: <DependentDetails/>
    },
    {
        path: "/test",
        component: <Test/>
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
        path: "/auth/forgot-password",
        component: <ForgotPassword/>
    },
    {
        path: "/auth/reset-password/:email/:token",
        component: <ResetPassword/>
    },
    {
        path: "/auth/register/:email/:token",
        component: <Register/>
    }
]

export {adminRoutes,userRoutes,authRoutes}