import React, { useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ProductContext } from "../ProductContext";
import ProductRows from "./ProductRows";

const ProductsTable = () => {
  const [Products, setProducts] = useContext(ProductContext);

  const handleDelete = (id) => {
    fetch("http://127.0.0.1:8000/product/" + id, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log("Delete response:", result);
        if (result.status === "ok") {
          const specificProduct = Products.data.filter((product) => product.id !== id);
          setProducts({ data: [...specificProduct] });
          alert("Product Deleted Successfully !!!!");
        } else {
          alert("Cannot delete the Product !!!");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting the Product !!!");
      });
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/product")
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setProducts({ data: [...results.data] });
      });
  }, [setProducts]);

  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="light" className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name of Product</th>
            <th>Stock Quantity</th>
            <th>Sold Quantity</th>
            <th>Unit Price</th>
            <th>Revenue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Products.data.map((product) => (
            <ProductRows
              id={product.id}
              name={product.name}
              stockQty={product.stockQty}
              soldQty={product.soldQty}
              unitPrice={product.unitPrice}
              revenue={product.revenue}
              key={product.id}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTable;
