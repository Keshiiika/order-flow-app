"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../navbar';
import Footer from '../footer';
import { CiUser, CiLocationOn } from 'react-icons/ci';
import { TiTickOutline } from 'react-icons/ti';
import confirm from '../../../public/confirm-order.jpg';
import failed from '../../../public/order-fail.png';

interface OrderData {
  products: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    discountedPrice: number;
    totalprice: number;
    discount: number;
  }[];
  paymentMethods: string[];
}

interface DeliveryAddress {
  name: string;
  address: string;
}

interface ConfirmationPageProps {
  paymentMethod: string;
  cardDetails: { cardNumber: string; expiryDate: string; cvv: string };
  upiDetails: string;
  upiVerificationResult: boolean | null;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  paymentMethod,
  cardDetails,
  upiDetails,
  upiVerificationResult,
}) => {
  const [orderData, setOrderData] = useState<OrderData>(() => {
    const storedData = localStorage.getItem('orderData');
    return storedData ? JSON.parse(storedData) : { products: [], paymentMethods: [] };
  });

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<DeliveryAddress>({ name: '', address: '' });

  const [promoCode, setPromoCode] = useState('');
//   const [discount, setDiscount] = useState(0);
const [discount, setDiscount] = useState<number>(0); 

  const promoCodes = [
    { code: 'DISCOUNT10', description: '10% Off', minOrderValue: 1000, discount: 10 },
    { code: 'GREAT15', description: '15% Off', minOrderValue: 2000, discount: 15 },
    { code: 'SUPER20', description: '20% Off', minOrderValue: 3000, discount: 20 },
  ];

  const [orderStatus, setOrderStatus] = useState<'Success' | 'Failure' | 'Pending'>('Pending');

  const handleAddOrChangeAddress = () => {
    setShowAddressModal(!showAddressModal);
  };

  const handleSaveAddress = () => {
    setDeliveryAddress(newAddress);
    localStorage.setItem('deliveryAddress', JSON.stringify(newAddress));
    setShowAddressModal(false);
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('deliveryAddress');
    setDeliveryAddress(storedAddress ? JSON.parse(storedAddress) : null);
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: prevOrderData.products.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      ),
    }));
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      products: prevOrderData.products.filter((product) => product.id !== productId),
    }));
  };

  const handleApplyPromoCode = () => {
    const selectedPromoCode = promoCodes.find(
      (code) =>
        code.code === promoCode &&
        orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0) >=
          code.minOrderValue
    );

    if (selectedPromoCode) {
      setDiscount(selectedPromoCode.discount || 0);
    } else {
      setDiscount(0); // Set discount to 0 if no valid promo code is applied
    }
  };

  useEffect(() => {
    // Simulate a random order status on component mount
    generateRandomOrderStatus();
  }, []);

  const generateRandomOrderStatus = () => {
    // Simulate a random order status
    const randomStatus = Math.random();
    if (randomStatus < 0.5) {
      setOrderStatus('Success');
    } else {
      setOrderStatus('Failure');
    }
  };

  return (
    <div>
      <Navbar />
      <>
        <div className="container ">
          <div className="row" style={{}}>
            <div className="col-sm-8" style={{ backgroundColor: '#f1f3f6' }}>
              <div className="container mt-2" style={{ backgroundColor: '#f1f3f6' }}>
                {orderData.products &&
                  orderData.products.map((product) => (
                    <>
                      <div
                        className="row p-2"
                        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        key={product.id}
                      >
                        <div className="col-sm-10 d-flex">
                          <Image src={product.image} alt="ssa" width="100" height="100" />
                          <div className="m-2">
                            <div>
                              <Link href="/">{product.title}</Link>&nbsp;&nbsp;<p>₹{product.price}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 d-flex justify-content-center align-items-center">
                          <p>Quantity: &nbsp;{product.quantity}&nbsp;</p>
                        </div>
                      </div>
                      <br></br>
                    </>
                  ))}
              </div>
            </div>

            <div className="col-sm-4" style={{ backgroundColor: '#f1f3f6' }}>
              <div
                className="cartGrossProfitBox p-3 mt-2 mb-2"
                style={{ backgroundColor: '#fff', borderRadius: '8px' }}
              >
                <p>Order Summary</p>
                <hr />
                <div className="d-flex justify-content-between">
                  <p>Overall Price:</p>
                  <p>₹{parseFloat(orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2))}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Discount:</p>
                  <p>
                    - ₹
                    {(
                      orderData.products.reduce(
                        (sum, product) =>
                          sum + (product.discount / 100) * product.price * product.quantity,
                        0
                      ) || 0
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Total Price:</p>
                  <p>
                    ₹
                    {(
                      orderData.products.reduce(
                        (sum, product) => sum + product.price * product.quantity,
                        0
                      ) -
                      orderData.products.reduce(
                        (sum, product) =>
                          sum + (product.discount / 100) * product.price * product.quantity,
                        0
                      )
                    ).toFixed(2) }
                  </p>
                </div>

                <hr></hr>
                <div className="m-1">
                  {!deliveryAddress ? (
                    <button type="button" className="btn btn-success btn-sm" onClick={handleAddOrChangeAddress}>
                      Add Address
                    </button>
                  ) : (
                    <div className="">
                      <p>Name: {`${deliveryAddress.name}`}</p>
                      <p>Address: {`${deliveryAddress.address}`}</p>
                      <br></br>
                    </div>
                  )}
                  {showAddressModal && (
                    <div className="addressModal">
                      <div className="form-floating mb-2 ">
                        <input
                          type="text"
                          className={`form-control `}
                          id="floatingPassword"
                          placeholder="Name"
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        />
                        <label htmlFor="floatingPassword">
                          <CiUser /> Your Name
                        </label>
                      </div>
                      <div className="form-floating mb-2 ">
                        <input
                          type="text"
                          className={`form-control `}
                          id="floatingPassword"
                          placeholder="Your Address"
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        />
                        <label htmlFor="floatingPassword">
                          <CiLocationOn />Your Address
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          handleSaveAddress();
                          setShowAddressModal(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                  <hr></hr>
                  <div className="m-1">
                    <p>Payment Method: {localStorage.getItem('paymentMethod')}</p>
                    {paymentMethod === 'card' && (
                      <div>
                        <p>Card Number: {cardDetails.cardNumber}</p>
                        <p>Expiry Date: {cardDetails.expiryDate}</p>
                        <p>CVV: {cardDetails.cvv}</p>
                      </div>
                    )}
                    {paymentMethod === 'upi' && (
                      <div>
                        <p>UPI Details: {upiDetails}</p>
                        {upiVerificationResult !== null && (
                          <p>Verification Result: {upiVerificationResult ? 'Correct' : 'Incorrect'}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <hr></hr>
                  <div className="d-flex justify-content-between">
                    <p>Status:</p>
                    {orderStatus === 'Success' ? (
                      <Image
                        src={confirm}
                        alt="Order Confirmed"
                        style={{ width: '50px', height: '40px' }}
                      />
                    ) : (
                      <Image src={failed} alt="Order Not Confirmed" style={{ width: '50px', height: '40px' }} />
                    )}
                  </div>
                  <p>{orderStatus === 'Success' ? 'Order Confirmed!' : 'Order Failed'}</p>
                  <hr></hr>
                  <br />
                  <Link href="/">
                    <button type="button" className="btn btn-primary w-100">
                      Home
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
