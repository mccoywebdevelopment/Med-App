import DependentView from "./views/admin/DependentView";
import GroupView from "./views/admin/GroupView";
import Login from "./views/shared/Login";

const adminRoutes = [
    {
        path: "/groups/all",
        component: GroupView,
    },
    {
        path: "/dependents/all",
        component: DependentView,
    }
];

const userRoutes = [
    {
        path:'/user/dependents/all'
    }
];

const authRoutes = [
    {
        path: "/auth/login",
        component: Login
    }
]

export {adminRoutes,userRoutes,authRoutes}