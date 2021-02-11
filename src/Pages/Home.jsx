import React from 'react'
import NavBar from '../components/NavBar'
import ProgramCatalog from './program-catalog'
import Login from '../components/Login'
import NavBar from '../components/NavBar'

const Home = ()=>{
    return(
        <div className='nav-fix container'>
            <NavBar/>
            <Login/>
        </div>
        <ProgramCatalog view="program"></ProgramCatalog>
      </div>
        );
}

export default Home
