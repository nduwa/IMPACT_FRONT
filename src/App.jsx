import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './css/style.css';
import './charts/ChartjsConfig';
// Import pages
import Dashboard from './pages/Dashboard';
import LoginForm from './pages/LoginForm';
import Users from './pages/users/users';
import Questions from './pages/inspections/Questions';
import Access_Modules from './pages/access_modules/access_modules';
import Farmers from './pages/farmers/Farmers';
import ApprovedFarmers from './pages/farmers/ApprovedFarmers';
import DeliveryProcessing from './pages/parchment/DeliveryProcessing';
import AssignParchment from './pages/parchment/AssignParchment';
import ActivityReport from './pages/reports/ActivityReport';
import ParchmentTransport from './pages/parchment/ParchmentTransport';
import ParchmentDelivery from './pages/parchment/ParchmentDelivery';
import NewParchment from './pages/parchment/NewParchment';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
     
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route exact path="/Dashboard" element={<Dashboard />} />
        <Route exact path='/user_admin' element={<Users/>} />
        <Route exact path='/inspection_admin' element={<Questions/>}/>
        <Route exact path='/access_admin' element={<Access_Modules/>}/>

        <Route exact path='/new_farmer' element={<Farmers/>}/>
        <Route exact path='/approved_farmer' element={<ApprovedFarmers/>}/>

        <Route exact path='/delivery_processing' element={<DeliveryProcessing/>}/>
        <Route exact path='/assign_parchment' element={<AssignParchment/>}/>
        <Route exact path='/assign_parchment/new_parchment' element={<NewParchment/>}/>
        <Route exact path='/parchment_transport' element={<ParchmentTransport/>}/>
        <Route exact path='/parchment_transport/new_delivery' element={<ParchmentDelivery/>}/>

        <Route exact path='/activity_report' element={<ActivityReport/>}/>

      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
