import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ProgramCatalog from './components/program-catalog/program-catalog'
import moduleCatalog from './components/moduleCatalog/moduleCatalog'
import Home from './Pages/Home'
import pageNotFound from './Pages/pageNotFound'
import test from './Pages/t'
import Profile from './components/profile/profile'

const Routes = () => {
  return (
    <Switch>
      {" "}
      {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route key="programs" exact path='/program-catalog' render={() => <ProgramCatalog layout={true} view="programs"/>}></Route>
      <Route key="courses" exact path='/courses-catalog' render={() => <ProgramCatalog layout={true} view="coursess"/>}></Route>
      <Route key="profile" exact path='/Profile' component={Profile}></Route>
      <Route exact path='/module-catalog/:courseId' component={moduleCatalog}></Route>
      <Route exact path='/test' component={test}></Route>
      <Route path='*' exact={true} component={pageNotFound} />
    </Switch>
  );
};

export default Routes;
