import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import AddEditProduct from "./pages/AddEditProduct"
import ProductDetail from "./pages/ProductDetail"
import MyProducts from "./pages/MyProducts"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Cart from "./pages/Cart"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add" element={<AddEditProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/my" element={<MyProducts />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
