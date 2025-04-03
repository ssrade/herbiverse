import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Components/Home/Home.jsx'
import Herbcatalog from './Components/Herbcatalog/Herbcatalog.jsx'
import RareSpecies from './Components/RareSpecies/RareSpecies.jsx'
import Layout from './Layout.jsx'
import ModelViewer from './Components/Herb/Modelviewer.jsx'
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Favourite from './Components/Favourite/Favourite.jsx'
import AboutUs from './Components/AboutUS/Aboutus.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";  // Note: Use named import with curly braces

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home/>}></Route>
      <Route path='/Herbcatalog' element={<Herbcatalog/>}></Route>
      <Route path='/Rarespecies' element={<RareSpecies/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Favourite' element={<Favourite/>}></Route>
      <Route path='/Aboutus' element={<AboutUs/>}></Route>
      <Route path="/herb/:herbId" element={<ModelViewer />}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)