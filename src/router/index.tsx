import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import CatalogPage from '../pages/CatalogPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import NotFound from '../components/NotFound';
import AdminLayout from '../layouts/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminLoginPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
