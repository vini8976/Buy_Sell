import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AddEditProduct from "./pages/AddEditProduct";
import ProductDetail from "./pages/ProductDetail";
import MyProducts from "./pages/MyProducts";

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
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
