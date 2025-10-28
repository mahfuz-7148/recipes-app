import React from 'react'
import {Navbar} from './navbar.jsx';
import {Footer} from './footer.jsx';
import {Outlet} from 'react-router';

export const MainNavigation = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
