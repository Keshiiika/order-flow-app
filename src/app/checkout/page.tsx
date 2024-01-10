"use client"
import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderData {
  products: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  paymentMethods: string[];
}

const CheckoutPage = () => {
  const [orderData, setOrderData] = useState<OrderData>(() => {
    const storedData = localStorage.getItem('orderData');
    return storedData ? JSON.parse(storedData) : { products: [], paymentMethods: [] };
  });

  useEffect(() => {
    console.log('Fetching data...');
    const fetchOrderData = async () => {
      try {
        const response = await fetch('https://groww-intern-assignment.vercel.app/v1/api/order-details');
        const data = await response.json();
        setOrderData(data);
        localStorage.setItem('orderData', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    // Update the quantity for the specified product
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: prevOrderData.products.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      ),
    }));
  };
  
  const handleRemoveProduct = (productId: number) => {
    // Remove the specified product from the order
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: prevOrderData.products.filter((product) => product.id !== productId),
    }));
  };

  return (
    <div>
      <Fragment>
            <div className="cartPage">
              <div className="cartHeader">
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
              </div>

              {orderData.products &&
                orderData.products.map((product) => (
                  <div className="cartContainer" key={product.id}>
                    <div className="CartItemCard">
                      <Image src={product.image} alt="ssa" width="50" height="50" />
                      <div>
                        <Link href="/">{product.title}</Link>
                        <span>{`Price: ₹${product.price}`}</span>
                        <div className='cartRemove'> 
                        <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
                        </div>
                    </div>
                  </div>
                                  
                    <div className="cartInput">
                    Quantity:
                    <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>
                      -
                    </button>
                    {product.quantity}
                    <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>
                      +
                    </button>
                    </div>
                    <p className='cartPrice'>Item Price: ${product.price * product.quantity}</p>
                  </div>
                ))}

              <div className="cartGrossProfit">
                <div></div>
                <div className="cartGrossProfitBox">
                  <p>Order Summary</p>
                  <p>Overall Price: ${orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0)}</p>

                </div>
                <div></div>
                {/* <div className="checkOutBtn">
                  <button onClick={checkoutHandler}>Check Out</button>
                </div> */}
              </div>
            </div>
      </Fragment>
    </div>
  );
};

export default CheckoutPage;
