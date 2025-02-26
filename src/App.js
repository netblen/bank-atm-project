// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ATMSimulator from './components/ATMSimulator';
import ForgotPassword from './components/ForgotPassword';
import Checking from './components/Checking';
import Savings from './components/Savings';
import Payments from './components/Payments';
import UserEdit from './components/UserEdit';
import SecurityPassword from './components/SecurityPassword';
import { UserProvider } from './components/UserContext';
import FeedbacknIssueReports from './components/FeedbacknIssueReports';
import UserTable from './components/UserTable';
import ActivityLog from './components/ActivityLog';
import EditUserAdmin from './components/EditUserAdmin';
import SystemPerformanceDashboard from './components/SystemPerformanceDashboard'
import ScheduleAppointment from './components/ScheduleAppointment';
import RateCustomerExperience from './components/RateCustomerExperience';
import RecentActivity from './components/RecentActivity';
import FinancialGoals from "./components/FinancialGoals";
import TransactionGlossary from "./components/TransactionGlossary";
import Locator from './components/Locator';
import Survey from './components/Survey';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
          <Route path="/rate-customer-experience" element={<RateCustomerExperience />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/SystemPerformanceDashboard" element ={<SystemPerformanceDashboard/>}/>
          <Route path="/users" element={<UserTable />}/>
          <Route path="/edit-user-admin/:userId" element={<EditUserAdmin />} />
          <Route path="/activityLog" element={<ActivityLog />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/atm-simulator" element={<ATMSimulator />} />
          <Route path="/RecentActivity" element={<RecentActivity />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checking" element={<Checking />} /> 
          <Route path="/savings" element={<Savings />} />
          <Route path="/UserEdit" element={<UserEdit />} />
          <Route path="/FeedbacknIssueReports" element={<FeedbacknIssueReports />} />
          <Route path="/security" element={<SecurityPassword />} />
          <Route path="/FinancialGoals" element={<FinancialGoals userId={1} />} />
          <Route path="/TransactionGlossary" element={<TransactionGlossary />} />
          <Route path="/Locator" element={<Locator />} />
          <Route path="/Survey" element={<Survey />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
