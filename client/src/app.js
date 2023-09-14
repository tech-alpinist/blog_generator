import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { Fragment } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Loading from 'components/Loading';

import Login from 'pages/Auth/Login';
import Home from 'pages/Home';
import CollectionsPage from 'pages/Collections'
import TemplatesPage from 'pages/Templates';
import NotFoundPage from 'pages/NotFound';

const GeneratorPage = lazy(() => import('pages/Generator'))
const EditPage = lazy(() => import('pages/Edit'))
const TemplatesEditPage = lazy(() => import('pages/TemplateEdit'))

const Protected = ({children}) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated === false) {
      navigate('/login');
    }

    return () => {}
  }, [])

  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={ <Login /> } />
        <Route path="/" element={ <Home /> } />
        <Route path="/generator" element={
          <Protected>
            <Suspense fallback={<Loading text='loading' />}>
              <GeneratorPage />
            </Suspense>
          </Protected>
        } />
        <Route path='/collections' element={
          <Protected>
            <CollectionsPage />
          </Protected>
        } />
        <Route path="/collection/:id" element={
          <Protected>
            <Suspense fallback={<Loading text='loading' />}>
              <EditPage />
            </Suspense>
          </Protected>
        } />
        <Route exact path="/templates" element={ 
          <Protected>
            <TemplatesPage />
          </Protected>
        } />
        <Route path="/template/new" element={ 
          <Protected>
            <Suspense fallback={<Loading text='loading' />}>
              <TemplatesEditPage isNew={true} />
            </Suspense>
          </Protected>
        } />
        <Route path="/template/:id" element={ 
          <Protected>
            <Suspense fallback={<Loading text='loading' />}>
              <TemplatesEditPage />
            </Suspense>
          </Protected>
        } />
        <Route path="*" element={ <NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}