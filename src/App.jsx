// App.js
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './pages/Dashboard/Layout';
import OverView from './pages/Overview/OverView';
import BIllBoard from './pages/BillBoard/BIllBoard';
import Categories from './pages/Categories/Categories';
import BillBoardFrom from './pages/BillBoard/BillBoardFrom';
import Sizes from './pages/Sizes/Sizes';
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
import Attributes from './pages/Attributes/Attributes';

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
    path: '/sizes',
    element: <Sizes />,
  },
  {
    path: '/attributes',
    element: <Attributes />,
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

  const { loading } = useSelector((state) => state.loaders); //for loading state chnage

  return (
    <>
      <div><Toaster /></div>
      <Header />
      {/* loader */}
      {loading && <div className="absolute backdrop-blur-sm z-[99] left-0 bottom-0  h-[90vh] w-screen flex justify-center items-center">
        <Spinner size='md' color="current" />
      </div>
      }
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
