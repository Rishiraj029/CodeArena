import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { Navigate, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from "react-hot-toast";

function App() {

  const {isSignedIn} = useUser()
  
  return (
    <>
    <Routes>

       <Route path="/" element={<HomePage />} />
       <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate  to={"/"} />} />

    </Routes>

    <Toaster toastOptions={{ duration:3000 }} />
   </>
  )
}

export default App
