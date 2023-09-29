import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { getAllOrders } from "./helper/adminapicall";
import { Link } from "react-router-dom";

const Vieworders = () => {
  const { user, token } = isAuthenticated();
  const [orders, setOrders] = useState([]);

  const preload = () => {
    getAllOrders().then((data) => {
      console.log(data)
      if (data.err) {
        console.log(data.err);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const getDayName = (dateString) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };
  

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric" };
    const formattedTime = new Date(dateString).toLocaleTimeString(
      undefined,
      options
    );
    return formattedTime;
  };

  return (
    <Base
      title="Manage Orders"
      description="Welcome to the order management section"
      className="container"
    >
      <table className="table table-dark table-borderless table-hover">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col-lg">Products</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Mode</th>
            <th scope="col">Day of Order</th>
            <th scope="col">Date of Order</th>
            <th scope="col">Time of Order</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            return (
              <tr key={index}>
                <td className="text-center text-white bg-dark rounded shadow">
                  Order ID: {order._id}
                </td>
                <td className="">
                  {order.products.map((product, index) => {
                    return (
                      <div
                        key={index}
                        className="text-white bg-dark rounded shadow w-100"
                      >
                        <div className="row-cols-lg-2">
                          <b>Name:</b> {product.name}
                        </div>
                        <div>
                          <b>Price:</b> {product.price}
                        </div>
                        <div>
                          <b>Quantity:</b> {product.count}kg
                        </div>
                      </div>
                    );
                  })}
                </td>
                <td className="text-center text-white bg-dark rounded shadow">
                  Total Amount: {order.amount}
                </td>
                <td className="text-center text-white bg-dark rounded shadow">
                  Mode: {order.transaction_id}
                </td>
                <td className="text-center text-white bg-dark rounded shadow">
                  {getDayName(order.createdAt)}
                </td>
                <td className="text-center text-white bg-dark rounded shadow">
                  {formatDate(order.createdAt)}
                </td>
                <td className="text-center text-white bg-dark rounded shadow">
                  {formatTime(order.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Base>
  );
};

export default Vieworders;
