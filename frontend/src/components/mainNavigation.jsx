import React from 'react'
import {Navbar} from './navbar.jsx';
import {Footer} from './footer.jsx';

export const MainNavigation = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
