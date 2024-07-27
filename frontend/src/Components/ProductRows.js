import React from "react";

const ProductRows = ({ id, name, stockQty, soldQty, unitPrice, revenue, handleDelete }) => {
  const formattedUnitPrice = Number(unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedRevenue = Number(revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{stockQty}</td>
      <td>{soldQty}</td>
      <td>${formattedUnitPrice}</td>
      <td>${formattedRevenue}</td>
      <td>
        <button className="btn btn-outline-info btn-sm mx-1"><b>Update</b></button>
        <button className="btn btn-outline-success btn-sm mx-1"><b>Supplier</b></button>
        <button onClick={() => handleDelete(id)} className="btn btn-outline-danger btn-sm mx-1"><b>Delete</b></button>
      </td>
    </tr>
  );
};

export default ProductRows;
