import { Routes, Route } from 'react-router-dom';
import MainRoutes from './routers/MainRoutes';
import AdminRoutes from './routers/AdminRoutes';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<MainRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
