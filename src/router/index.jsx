import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Students = lazy(() => import("@/components/pages/Students"));
const Grades = lazy(() => import("@/components/pages/Grades"));
const Attendance = lazy(() => import("@/components/pages/Attendance"));
const Classes = lazy(() => import("@/components/pages/Classes"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "students",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Students />
      </Suspense>
    ),
  },
  {
    path: "grades",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Grades />
      </Suspense>
    ),
  },
  {
    path: "attendance",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Attendance />
      </Suspense>
    ),
  },
  {
    path: "classes",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Classes />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
];

export const router = createBrowserRouter(routes);