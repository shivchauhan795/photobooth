import { Suspense, lazy } from "react"
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom"
import { SemiProtectedRoutes } from "./SemiProtectedRoutes"
import { ProtectedRoutes } from "./ProtectedRoutes"
const Home = lazy(() => import("./pages/home/Home"))
const Customize = lazy(() => import("./pages/customize/Customize"))
const Capture = lazy(() => import("./pages/capture/Capture"))
const Login = lazy(() => import("./pages/auth/Login"))
const Signup = lazy(() => import("./pages/auth/Signup"))
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"))


function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className='w-full h-screen flex justify-center items-center'>
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/customize" element={<Customize />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<SemiProtectedRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App