// App.js
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './pages/Dashboard/Layout';
import OverView from './pages/Overview/OverView';
import BIllBoard from './pages/BillBoard/BIllBoard';
import Categories from './pages/Categories/Categories';
import CategoriesForm from './pages/Categories/CategoriesForm';
import BillBoardFrom from './pages/BillBoard/BillBoardFrom';
import Sizes from './pages/Sizes/Sizes';
import SizesForm from './pages/Sizes/SizesForm';
import Colors from './pages/Colors/Colors';
import ColorsForm from './pages/Colors/ColorsForm';
import Products from './pages/Products/Products';
import ProductsForm from './pages/Products/ProductsForm';
import Orders from './pages/Orders/Orders';
import Setting from './pages/Settinngs/Setting';
import Header from './components/Navbar/Header';
import LoginPage from './pages/LoginPage/LoginPage';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/Private/PrivateRoute';
import { Spinner } from "@nextui-org/react";
import { useSelector } from 'react-redux';

const routesConfig = [
  // { path: '/login', element: <LoginPage /> },
  { path: '/', element: <OverView /> },
  {
    path: '/billboards',
    element: <BIllBoard />,
    routes: [{ path: ':id', element: <BillBoardFrom /> }],
  },
  {
    path: '/billboards/:id',
    element: <BillBoardFrom />,
  },
  {
    path: '/categories',
    element: <Categories />,
  },
  {
    path: '/categories/:id',
    element: <CategoriesForm />,
  },
  {
    path: '/sizes',
    element: <Sizes />,
  },
  {
    path: '/sizes/:id',
    element: <SizesForm />,
  },
  {
    path: '/colors',
    element: <Colors />,
  },
  {
    path: '/colors/:id',
    element: <ColorsForm />,
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/products/:id',
    element: <ProductsForm />,
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/settings',
    element: <Setting />,
  },
];

function generateRoutes(config) {
  return config.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={
        <PrivateRoute>
          <DashboardLayout>
            {route.element}
          </DashboardLayout>
        </PrivateRoute>
      }
    />
  ));
}

function App() {

  const { loading } = useSelector((state) => state.loaders);

  return (
    <>
      {/* {
        loading && <div className="absolute backdrop-blur-sm z-[9999999] left-0 top-0  h-screen w-screen flex justify-center items-center">
          <Spinner size='md' color="current" />
        </div>
      } */}
      <div><Toaster /></div>
      <Header />
      <Routes>
        {generateRoutes(routesConfig)}
        <Route
          path='/login'
          element={<LoginPage />}
        />
      </Routes>

    </>
  );
}

export default App;
