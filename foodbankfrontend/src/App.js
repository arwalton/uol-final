import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import Home from "./components/home/Home"
import Signup from "./components/signup/Signup"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Header from "./components/header/Header"
import RequireAuthentication from "./utils/RequireAuthentication.js";
import { AuthenticationContextProvider } from "./contextProviders/authentication/AuthenticationContext.jsx"
import { OrderContextProvider } from "./contextProviders/orders/OrderContext.js"
import axios from 'axios'
import OrderCreated from "./components/orders/OrderCreated.js";

axios.defaults.baseURL = "http://127.0.0.1:8000"

const App = () => {

  return(
    <BrowserRouter>
      <AuthenticationContextProvider>
        <Header>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <RequireAuthentication>
                <OrderContextProvider>
                  <Dashboard />
                </OrderContextProvider>
              </RequireAuthentication>
            } />
            <Route path="/order-created" element={
              <RequireAuthentication>
                <OrderContextProvider>
                  <OrderCreated />
                </OrderContextProvider>
              </RequireAuthentication>
            } />
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Header>
        <ToastContainer hideProgressBar newestOnTop />
      </AuthenticationContextProvider>
    </BrowserRouter>
  )
}

export default App;
