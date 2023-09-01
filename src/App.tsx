import {createBrowserRouter} from 'react-router-dom'
import {Home} from './pages/home'
import {Login} from './pages/login'
import {Register} from './pages/register'
import {Dasboard} from './pages/dashboard'
import {New} from './pages/dashboard/new'
import {ServDetail} from './pages/serv'

import {Layout} from './components/layout'

const router = createBrowserRouter([
  {
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/serv/:id",
        element:<ServDetail/>
      },
      {
        path:"dashboard",
        element:<Dasboard/>
      },
      {
        path:"dashboard/new",
        element:<New/>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  }
])

export {router};