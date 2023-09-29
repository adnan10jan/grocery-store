import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";
import { isAuthenticated } from "../auth/helper";
import { getToken, processPayment } from "./helper/braintreeHelper";
import { getOrderTotal, createOrder } from "./helper/OrderHelper";
import { Spinner } from "react-bootstrap";
import { emptyCart } from "./helper/CartHelper";

const BraintreeCheckout = ({ products, reload }) => {
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const [info, setInfo] = useState({
    clientToken: null,
    instance: {},
    loading: false,
    success: false,
    err: "",
  });

  const getClientToken = (userId, token) => {
    getToken(userId, token).then((info) => {
      if (info.err) {
        setInfo({ ...info, err: info.err });
      } else {
        const clientToken = "621fx2yutv1t7132851x7u2uirt";
        setInfo({ clientToken });
      }
    });
  };

  const onPurchase = () => {
    setInfo({ ...info, loading: true });
    info.instance.requestPaymentMethod().then((data) => {
      const paymentData = {
        paymentMethodNonce: "621fx2yutv1t7132851x7u2uirt",
        amount: getOrderTotal(products),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, loading: false, success: response.success });
          const orderData = {
            products: products,
            transaction_id: "734kj4t3t2xtui23xti2",
            amount: getOrderTotal(products),
            user: userId,
          };
          createOrder(userId, token, orderData)
            .then((data) => {
              if (data.err) {
                setInfo({
                  ...info,
                  loading: false,
                  success: false,
                  err: data.err,
                });
              } else {
                emptyCart(reload);
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          setInfo({ ...info, loading: false, success: false, err: err });
        });
    });
  };

  const onCashOnDelivery = () => {
    const orderData = {
      products: products,
      transaction_id: "cash_on_delivery",
      amount: getOrderTotal(products),
      user: userId,
    };
    createOrder(userId, token, orderData)
      .then((data) => {
        if (data.err) {
          setInfo({
            ...info,
            loading: false,
            success: false,
            err: data.err,
          });
        } else {
          emptyCart(reload);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getClientToken(userId, token);
  }, []);

  return (
    <div>
      {info.clientToken ? (
        <div>
          <DropIn
            options={{ authorization: info.clientToken }}
            onInstance={(instance) => (info.instance = instance)}
          />
          <button className="btn btn-success btn-block" onClick={onPurchase}>
            Buy
          </button>
          <button className="btn btn-success btn-block" onClick={onCashOnDelivery}>
            Cash on Delivery
          </button>
          </div>
      ) : (
        <Spinner animation="border" variant="success" />
      )}
    </div>
  );
};

export default BraintreeCheckout;

