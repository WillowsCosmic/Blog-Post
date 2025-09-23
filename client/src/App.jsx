import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout/layout'
import { RouteIndex, RouteSignIn, RouteSignUp } from './helpers/RouteName'
import Index from './Pages'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />} />
        </Route>
        <Route path={RouteSignIn} element={<Signin/>}/>
        <Route path={RouteSignUp} element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App