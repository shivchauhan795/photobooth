import { Suspense, lazy } from "react"
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom"
import Capture from "./pages/capture/Capture"
import Customize from "./pages/customize/Customize"
const Home = lazy(() => import("./pages/home/Home"))


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
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App