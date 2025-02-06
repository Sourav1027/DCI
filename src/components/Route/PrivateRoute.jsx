import React from 'react'

function ProtectedRoute (){
const isLoggedIn = window.localStorage.getItem("loggenIn");

return isLoggedIn === "true" ? <Outlet/>:<Navigate to= 'Login'/>;

}

export default ProtectedRoute
