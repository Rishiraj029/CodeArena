import { useUser } from '@clerk/clerk-react';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';
import ProblemsPage from './pages/ProblemsPage';
import SessionPage from './pages/SessionPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {

  const {isSignedIn, isLoaded} = useUser()
  
  if(!isLoaded) return null;

  return (
    <>
    <Routes>

      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
       <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate  to={"/"} />} />
       <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate  to={"/"} />} />
       <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate  to={"/"} />} />
       <Route path="/submissions" element={isSignedIn ? <SubmissionsPage /> : <Navigate to={"/"} />} />
       <Route path="/submissions/:submissionId" element={isSignedIn ? <SubmissionDetailPage /> : <Navigate to={"/"} />} />
       <Route path="/users/:userId" element={<UserProfilePage />} />

    </Routes>

    <Toaster toastOptions={{ duration:3000 }} />
   </>
  )
}

export default App
