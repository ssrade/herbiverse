import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Components/Home/Home.jsx'
import Herbcatalog from './Components/Herbcatalog/Herbcatalog.jsx'
import Layout from './Layout.jsx'
import ModelViewer from './Components/Herb/Modelviewer.jsx'
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Favourite from './Components/Favourite/Favourite.jsx'
<<<<<<< HEAD
import Aboutus from './Components/AboutUs/Aboutus.jsx'
=======
import AboutUS from './Components/AboutUS/AboutUS.jsx'
>>>>>>> c46376b3f436eec80b7506588d430b542026e590
import { AuthProvider } from "./context/AuthContext.jsx";  // Note: Use named import with curly braces

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home/>}></Route>
      <Route path='/Herbcatalog' element={<Herbcatalog/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Favourite' element={<Favourite/>}></Route>
<<<<<<< HEAD
      <Route path='/Aboutus' element={<Aboutus/>}></Route>
=======
      <Route path='/AboutUS' element={<AboutUS/>}></Route>
>>>>>>> c46376b3f436eec80b7506588d430b542026e590
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