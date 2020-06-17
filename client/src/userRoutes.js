import Register from "views/shared/Register.jsx";
import UserMedTable from "views/user/UserMedTable.jsx";
import Calendar from "views/user/ViewCalendar";
import Login from "./views/shared/Login";
import ForgotPassword from "views/shared/ForgotPassword.jsx";
import Logout from "views/shared/Logout.jsx";
import ResetPassword from "views/shared/ResetPassword.jsx";

var userRoutes = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "faHome",
      class: "ni ni-tv-2 text-primary",
      component: UserMedTable,
      layout: "/user",
      show:true
    },
    {
      path: "/calendar",
      name: "Calendar",
      class: "ni ni-tv-2 text-primary",
      icon:"faCalendar",
      component: Calendar,
      layout: "/user",
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
      path: "/forgot-password",
      name: "forgot password",
      class: "ni ni-tv-2 text-primary",
      icon:"faDatabase",
      component: ForgotPassword,
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
      path: "/logout",
      name: "",
      icon: "ni ni-circle-08 text-pink",
      component: Logout,
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
    }
];
export default userRoutes;
