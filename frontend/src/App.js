import React from "react";
import NavBar from "./Components/NavBar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProductProvider } from "./ProductContext";
import ProductsTable from "./Components/ProductTable";
import AddProduct from "./Components/AddProduct";

function App() {
  return (
    <div>
      <Router>
        <ProductProvider>
          <NavBar />
          <div className="container mt-4 mb-4">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-xm-12">
                <Routes>
                  <Route exact path="/" Component={ProductsTable} />
                  <Route exact path="/addproduct" Component={AddProduct} />
                </Routes>
              </div>
            </div>
          </div>
        </ProductProvider>
      </Router>
    </div>
  );
}

export default App;
