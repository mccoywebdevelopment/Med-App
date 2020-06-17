import Register from "views/shared/Register.jsx";
import Login from "views/shared/Login.jsx";
import ViewMeds from "views/admin/medication/ViewDependents.jsx";
import ViewUsers from "views/admin/user/ViewUsers.jsx";
import ViewGroup from "views/admin/group/ViewGroup.jsx";
import ViewCalendarAdmin from "views/admin/calendar/ViewCalendarAdmin.jsx";
import ExportDataView from "views/admin/exportData/ExportDataView.jsx";
import ForgotPassword from "views/shared/ForgotPassword.jsx";
import ResetPassword from "views/shared/ResetPassword.jsx";
// import AdminTableTwo from "./components/admin/AdminTableTwo/AdminTableTwo";
import DependentTableTest from "./components/admin/AdminTable/DependentTableTest";
import Logout from "views/shared/Logout.jsx";

var adminRoutes = [
  {
    path: "/groups",
    name: "Groups",
    icon: "faUsers",
    class:"ni ni-tv-2 text-primary",
    component: ViewGroup,
    layout: "/admin",
    show:true
  },
  {
    path: "/test",
    name: "Test",
    icon: "faUsers",
    class:"ni ni-tv-2 text-primary",
    component: DependentTableTest,
    layout: "/admin",
    show:true
  },
  {
    path: "/dependents",
    name: "Rxs/Dependents",
    icon: "faCapsules",
    class:"ni ni-tv-2 text-primary",
    component: ViewMeds,
    layout: "/admin",
    show:true
  },
  {
    path: "/users",
    name: "Users",
    class: "ni ni-tv-2 text-primary",
    icon:"faUser",
    component: ViewUsers,
    layout: "/admin",
    show:true
  },
  {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: Login,
      layout: "/auth",
      show:false
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      component: Login,
      layout: "/auth",
      show:false
    },
    {
      path: "/register/:email/:token",
      name: "",
      icon: "ni ni-circle-08 text-pink",
      component: Register,
      layout: "/auth",
      show:false
    },
    {
      path: "/calendar",
      name: "Calendar",
      class: "ni ni-tv-2 text-primary",
      icon:"faCalendar",
      component: ViewCalendarAdmin,
      layout: "/admin",
      show:true
    },
    {
      path: "/data",
      name: "Export Data",
      class: "ni ni-tv-2 text-primary",
      icon:"faDatabase",
      component: ExportDataView,
      layout: "/admin",
      show:true
    },
    {
      path: "/forgot-password",
      name: "forgot password",
      class: "ni ni-tv-2 text-primary",
      icon:"faDatabase",
      component: ForgotPassword,
      layout: "/auth",
      show:false
    },
    {
      path: "/reset-password/:email/:token",
      name: "forgot password",
      class: "ni ni-tv-2 text-primary",
      icon:"faDatabase",
      component: ResetPassword,
      layout: "/auth",
      show:false
    },
    {
      path: "/logout",
      name: "",
      icon: "ni ni-circle-08 text-pink",
      component: Logout,
      layout: "/auth",
      show:false
    },
    // {
    //   path: "/test",
    //   name: "",
    //   icon: "ni ni-circle-08 text-pink",
    //   component: AdminTableTwo,
    //   layout: "/admin",
    //   show:false
    // },
];
export default adminRoutes;
