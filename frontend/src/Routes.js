import DependentView from "./views/admin/DependentView";
import GroupView from "./views/admin/GroupView";

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
const userRoutes = [];

export {adminRoutes,userRoutes}