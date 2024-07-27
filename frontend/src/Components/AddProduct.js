import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [productInfo, setProductInfo] = useState({
        productName: "",
        stockQty: "",
        soldQty: "",
        unitPrice: "",
        revenue: "",
        supplier: ""
    });

    const navigate = useNavigate();

    const updateForm = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    const postData = async (e) => {
        e.preventDefault();
    
        const url = "http://127.0.0.1:8000/product/" + productInfo['supplier'];
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    "name": productInfo['productName'],
                    "stockQty": productInfo['stockQty'],
                    "soldQty": productInfo['soldQty'],
                    "unitPrice": productInfo['unitPrice'],
                    "revenue": productInfo['revenue']
                })
            });
    
            const data = await response.json();
            console.log(data);
    
            if (response.ok) {
                alert("Successfully Added the Product !!!!!");
            } else {
                alert("Adding Product Failed !!!!");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("An error occurred while adding the product.");
        }
    
        setProductInfo({
            productName: "",
            stockQty: "",
            soldQty: "",
            unitPrice: "",
            revenue: "",
            supplier: ""
        });

        navigate('/');
    };

    return (
        <Card className="my-4">
            <Card.Body>
                <Form onSubmit={postData}>
                    <Form.Group controlId="productName">
                        <Form.Label><b>Name of Product</b></Form.Label>
                        <Form.Control 
                            type="text" 
                            name="productName" 
                            value={productInfo.productName} 
                            onChange={updateForm} 
                            placeholder="Product Name" 
                            className="mb-3" 
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="stockQty">
                        <Form.Label><b>Quantity in Stock</b></Form.Label>
                        <Form.Control 
                            type="number" 
                            name="stockQty" 
                            value={productInfo.stockQty} 
                            onChange={updateForm} 
                            placeholder="Stock Quantity" 
                            className="mb-3" 
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="soldQty">
                        <Form.Label><b>Quantity Sold</b></Form.Label>
                        <Form.Control 
                            type="number" 
                            name="soldQty" 
                            value={productInfo.soldQty} 
                            onChange={updateForm} 
                            placeholder="Sold Quantity" 
                            className="mb-3" 
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="unitPrice">
                        <Form.Label><b>Unit Price</b></Form.Label>
                        <Form.Control 
                            type="number" 
                            name="unitPrice" 
                            value={productInfo.unitPrice} 
                            onChange={updateForm} 
                            placeholder="Unit Price" 
                            className="mb-3" 
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="revenue">
                        <Form.Label><b>Revenue</b></Form.Label>
                        <Form.Control 
                            type="number" 
                            name="revenue" 
                            value={productInfo.revenue} 
                            onChange={updateForm} 
                            placeholder="Revenue" 
                            className="mb-3" 
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="supplier">
                        <Form.Label><b>Supplier</b></Form.Label>
                        <Form.Control 
                            type="text" 
                            name="supplier" 
                            value={productInfo.supplier} 
                            onChange={updateForm} 
                            placeholder="Supplier" 
                            className="mb-3" 
                        />
                    </Form.Group>

                    <Button variant="success" type="submit">Submit</Button>
                    <Link exact to="/" className="btn btn-danger mx-5">Cancel</Link>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default AddProduct;
