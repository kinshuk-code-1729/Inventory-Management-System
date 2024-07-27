import React, { useContext, useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Badge, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { ProductContext } from '../ProductContext';

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [Products, setProducts] = useContext(ProductContext);

  const fetchedContent = (e) => {
    setSearch(e.target.value);
  }

  const filterData = (e) => {
    e.preventDefault();
    const filteredProducts = Products.data.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setProducts({ "data": filteredProducts });
    setSearch(""); // Clear search input after filtering
  }

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="/">Inventory Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto d-flex align-items-center">
            <Badge className="custom-badge ms-2 mb-2 mt-2">Products in Stock {Products.data.length}</Badge>
          </Nav>
          <Form onSubmit={filterData} className="d-flex align-items-center ms-auto custom-form">
            <Link to="/addproduct" className="btn btn-primary btn-sm custom-add-product-btn me-2">Add Product</Link>
            <FormControl
              value={search}
              onChange={fetchedContent}
              type="text"
              placeholder="Search"
              className="me-2 custom-form-control"
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
