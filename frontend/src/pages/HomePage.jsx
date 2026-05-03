import { SignedOut, SignedIn, SignInButton, UserButton, SignOutButton } from '@clerk/clerk-react';
import React from 'react'
import toast from "react-hot-toast";



function HomePage() {

  
  
  return (
    <div>
 
 <button className="btn btn-secondary" onClick={() => toast.error("This is a success toast")}>Click me</button>

   <SignedOut>
    <SignInButton mode="modal">
      <button>Log In</button>
    </SignInButton>
   </SignedOut>

   <SignedIn>
    <SignOutButton />
   </SignedIn>

   <UserButton />

   </div>   
  )
};


export default HomePage