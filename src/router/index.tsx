import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import CatalogPage from '../pages/CatalogPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import NotFound from '../components/NotFound';

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
]);
