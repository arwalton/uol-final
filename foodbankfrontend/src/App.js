import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import Home from "./components/home/Home"
import Signup from "./components/signup/Signup"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import { AuthenticationContextProvider } from "./contextProviders/authentication/AuthenticationContext.jsx"
import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8000"
// import HelloWorld from './HelloWorld';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

const App = () => {

  return(
    <AuthenticationContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer hideProgressBar newestOnTop />
    </AuthenticationContextProvider>
  )
}

// function App() {
//   const [csrf, setCsrf] = useState('')
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   const getCSRF = () => {
//     axios.get('http://localhost:8000/api/csrf/', {
//       credentials: "include"
//     })
//     .then((res) => {
//       const csrfToken = res.headers.get("X-CSRFToken")
//       setCsrf(csrfToken);
//       console.log("CSRF Token", csrfToken)
//     })
//     .catch((err) => {
//       console.log(err);
//     })
//   }

//   const getSession = () => {
//     axios.get('http://localhost:8000/api/session/', {
//       credentials: "include"
//     })
//     .then((res) => res)
//     .then((data) => {
//       console.log("Session data", data)
//       if(data.isAuthenticated) {
//         setIsAuthenticated(true)
//       } else {
//         setIsAuthenticated(false)
//         getCSRF();
//       }
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   }

//   useEffect(() => {
//     getSession()
//   }, [])

//   const whoami = () => {
//     axios.get('http://localhost:8000/api/whoami/', {
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include"
//     })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("You are logged in as: " + data.username)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   }

//   const isResponseOk = (response) => {
//     if(response.status >= 200 && response.status <= 299){
//       return response.json();
//     }
//     throw Error(response.statusText)
//   }

//   const login = () => {
//     axios.post('http://localhost:8000/api/login/', {
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrf,
//       },
//       credentials: "include",
//       body: JSON.stringify({username: username, password: password})
//     })
//     .then(isResponseOk)
//     .then((data) => {
//       console.log("login data", data);
//       setIsAuthenticated(true)
//       setUsername('')
//       setPassword('')
//       setError('')
//     })
//     .catch((err) => {
//       console.log(err);
//       setError("Wrong username or password.")
//     })
//   }

//   const logout = () => {
//     axios.get('http://localhost:8000/api/logout/', {
//       credentials: "include"
//     })
//     .then(isResponseOk)
//     .then((data) => {
//       console.log("logout data", data)
//       setIsAuthenticated(false)
//       getCSRF();
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   }

//   return (
//     <div className="App">
//       <HelloWorld />
      
//       <div>
//         <h2>React Cookie Auth</h2>
//         {isAuthenticated ? (
//           <>
//             <p>You are logged in!</p>
//             <button onClick={whoami}>WhoAmI</button>
//             <button onClick={logout}>Log out</button>
//           </>
//         ) : (
//           <>
//           <h2>Login</h2>
//           <form onSubmit={login}>
//             <div>
//               <label htmlFor="username">Username</label>
//               <input type="text" id="username" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
//             </div>
//             <div className="form-group">
//               <label htmlFor="username">Password</label>
//               <input type="password" id="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
//               <div>
//                 {error &&
//                   <small>
//                     {error}
//                   </small>
//                 }
//               </div>
//             </div>
//             <button type="submit">Login</button>
//           </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

export default App;
