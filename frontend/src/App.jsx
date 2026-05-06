import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { Navigate, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from "react-hot-toast";

function App() {

  const {isSignedIn, isLoaded} = useUser()
  
  if(!isLoaded) return null;

  return (
    <>
    <Routes>

      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
       <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate  to={"/"} />} />

    </Routes>

    <Toaster toastOptions={{ duration:3000 }} />
   </>
  )
}

export default App
