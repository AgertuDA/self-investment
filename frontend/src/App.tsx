import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Routing
import PrivateRoute from "./components/routing/PrivateRoute";

// Screens
import DashboardScreen from "./components/screens/DashboardScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";
import QuestionnaireScreen from "./components/screens/QuestionnaireScreen";
import HobbiesScreen from "./components/screens/HobbiesScreen";
import ProofSubmissionScreen from "./components/screens/ProofSubmissionScreen";
import ChallengesScreen from "./components/screens/ChallengesScreen";
import RewardsScreen from "./components/screens/RewardsScreen";
import AdminPanelScreen from "./components/screens/AdminPanelScreen";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<PrivateRoute component={DashboardScreen} />} />
        <Route path="/dashboard" element={<PrivateRoute component={DashboardScreen} />} />
        <Route path="/questionnaire" element={<PrivateRoute component={QuestionnaireScreen} />} />
        <Route path="/hobbies" element={<PrivateRoute component={HobbiesScreen} />} />
        <Route path="/proofs" element={<PrivateRoute component={ProofSubmissionScreen} />} />
        <Route path="/challenges" element={<PrivateRoute component={ChallengesScreen} />} />
        <Route path="/rewards" element={<PrivateRoute component={RewardsScreen} />} />
        <Route path="/admin" element={<PrivateRoute component={AdminPanelScreen} />} />
        <Route path="/admin/proofs" element={<PrivateRoute component={AdminPanelScreen} />} />
        <Route path="/admin/challenges" element={<PrivateRoute component={AdminPanelScreen} />} />
        <Route path="/admin/users" element={<PrivateRoute component={AdminPanelScreen} />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
        <Route
          path="/passwordreset/:resetToken"
          element={<ResetPasswordScreen />}
        />
      </Routes>
    </div>
  );
};

export default App;
