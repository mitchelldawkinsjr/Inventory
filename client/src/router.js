import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";
import HelloWorld from "./components/HelloWorld";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: "/app/rev",
  },
  {
    path: "/app",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/app/rev",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "rev",
        component: () =>
          import(/* webpackChunkName: "piaf" */ "./views/app/rev"),
        redirect: "/app/rev/start",
        children: [
          { path: 'start', component: () => import(/* webpackChunkName: "piaf" */ './components/HelloWorld') }
        ]
      },
      {
        path: "add",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/single")
      },
      {
        path: "list",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/list")
      }
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },

    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
