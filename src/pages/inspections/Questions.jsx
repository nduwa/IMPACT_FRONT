import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import FilterButton from '../../components/DropdownFilter';
import Datepicker from '../../components/Datepicker';
import Banner from '../../partials/Banner';
import DashboardCard01 from '../../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../../partials/dashboard/DashboardCard02';
import WelocomeBanner from '../../partials/dashboard/WelcomeBanner';

function Questions() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:justify-between sm:items-center mb-8">
              <WelocomeBanner/>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              <h1>Inspection Questions</h1>
              {/* Card (Recent Activity) */}
              <DashboardCard01 />
              {/* Card (Income/Expenses) */}
              <DashboardCard02 />
              
            </div>

          </div>
        </main>

        <Banner />

      </div>
    </div>
  );
}

export default Questions;