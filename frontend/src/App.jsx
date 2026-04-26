import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton } from '@clerk/clerk-react';


function App() {
  
  return (
    <>
      <h1>Welcome To The App</h1>

   <SignedOut>
      <SignInButton mode="modal">
        <button>
          Login
        </button>
        </SignInButton>
   </SignedOut>

   <SignedIn>
      <SignOutButton mode="modal"/>
   </SignedIn>

   
   <UserButton />

    </>
  )
}

export default App
