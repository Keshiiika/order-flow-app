"use client"
import React, { useEffect, Fragment } from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Navbar from '../navbar'
import Footer from '../footer';
import noproduct from '../../../public/before-login-no-product-in-cart-4006356-3309942.png'

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

interface DeliveryAddress {
  name: string;
  address: string;
}
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  discountedPrice?: number; 
  totalprice:number;
  discount:number;
}


const CheckoutPage = () => {
//   const [orderData, setOrderData] = useState<OrderData>(() => {
//     const storedData = localStorage.getItem('orderData');
//     return storedData ? JSON.parse(storedData) : { products: [], paymentMethods: [] };
//   });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<DeliveryAddress>({ name: '', address: '' });
  const [discount, setDiscount] = useState<number>(0);
  const promoCodes = useMemo(
    () => [
      { code: 'DISCOUNT10', description: '10% Off', minOrderValue: 1000, discount: 10 },
      { code: 'GREAT15', description: '15% Off', minOrderValue: 2000, discount: 15 },
      { code: 'SUPER20', description: '20% Off', minOrderValue: 3000, discount: 20 },
    ],
    [] // Empty dependency array as promoCodes doesn't depend on any other state or prop
  );
  const [promoCode, setPromoCode] = useState('');
  const [orderData, setOrderData] = useState<OrderData>(() => {
      const storedData = localStorage.getItem('orderData');
      return storedData ? JSON.parse(storedData) : { products: [], paymentMethods: [] };
    });
    
  
  const updateLocalStorage = (data: OrderData) => {
    localStorage.setItem('orderData', JSON.stringify(data));
  };

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

  const handleApplyPromoCode = () => {
    const selectedPromoCode = promoCodes.find(
      (code) =>
        code.code === promoCode &&
        orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0) >= code.minOrderValue
    );
  
    if (selectedPromoCode) {
      const appliedDiscount = selectedPromoCode.discount || 0;
      setDiscount(appliedDiscount);
      const updatedProducts = orderData.products.map((product) => {
        const discountedPrice = (appliedDiscount / 100) * product.price * product.quantity;
        const totalprice = product.price * product.quantity - discountedPrice;
  
        return {
          ...product,
          discountedPrice,
          totalprice,
          discount: appliedDiscount,
        };
      });
      const updatedOrderData = {
        ...orderData,
        products: updatedProducts,
      };
      updateLocalStorage(updatedOrderData);
    }
  };
  
  useEffect(() => {
    console.log('Fetching data...');
    const fetchOrderData = async () => {
      try {
        const response = await fetch('https://groww-intern-assignment.vercel.app/v1/api/order-details');
        const data = await response.json();
        setOrderData(data);
        const storedDiscount = localStorage.getItem('discount');
        const discountValue = storedDiscount ? parseFloat(storedDiscount) : 0;
        const totalWithDiscount = data.products.reduce(
          (sum: number, product: Product) => sum + product.price * product.quantity,0) - ((discountValue / 100) * data.products.reduce((sum: number, product: Product) => sum + product.price * product.quantity,0));
        const updatedOrderData = { ...data, products: data.products };
        updateLocalStorage(updatedOrderData);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);
  useEffect(() => {
      const fetchOrderData = async () => {
        try {
          // Check if localStorage is available before using it
          if (typeof localStorage !== 'undefined') {
            const storedData = localStorage.getItem('orderData');
            // ... (rest of the code)
          }
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };
  
      fetchOrderData();
    }, []);
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
      newQuantity = Math.max( 0 , newQuantity  )
    setOrderData((prevOrderData) => {
      const updatedOrderData = {
        ...prevOrderData,
        products: prevOrderData.products.map((product) =>
          product.id === productId ? { ...product, quantity: newQuantity } : product
        ),
      };
      updateLocalStorage(updatedOrderData);
      return updatedOrderData;
    });
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderData((prevOrderData) => {
      const updatedOrderData = {
        ...prevOrderData,
        products: prevOrderData.products.filter((product) => product.id !== productId),
      };
      updateLocalStorage(updatedOrderData);
      return updatedOrderData;
    });
  };
  

  return (
    <div className=''>
          <Navbar/>
       
            <div className='container' style={{backgroundColor:'#f1f3f6',flex:1}}>
                  <div className='row'>
                        <div className='col-sm-8' style={{backgroundColor:'#f1f3f6'}}>
                              <div className='container mt-2' style={{ backgroundColor:'#f1f3f6'}}> 
                                    {orderData.products && orderData.products.length > 0 ? (
                                          orderData.products.map((product) => ( 
                                                <>
                                                      <div className="row p-2" style={{backgroundColor:'#fff',borderRadius:'8px'}} key={product.id}>
                                                            <div className="col-sm-10 d-flex">
                                                                  <Image src={product.image} alt="ssa" width="100" height="100" />  
                                                                  <div className='m-2'>
                                                                        <div>
                                                                              <Link href="/">{product.title}</Link>&nbsp;&nbsp;
                                                                              <p>{`₹${product.price}`}</p>
                                                                        </div>
                                                                        <div className='d-flex' >
                                                                              <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveProduct(product.id)}>Remove</button>
                                                                              <div className="mx-1 d-flex justify-content-center align-items-center" style={{width:'7rem',height:'1.5rem'}} >
                                                                              
                                                                                    <button onClick={() => handleQuantityChange(product.id, product.quantity - 1) } className='d-flex justify-content-center align-items-center bg-danger' style={{width:'2.5rem',height:'1.5rem',outline:'none'}}><FaMinus style={{color:'white'}}/></button>
                                                                                          <p className='d-flex align-items-center mb-0  p-0 justify-content-center' style={{width:'2rem',fontSize:'0.9rem'}}>&nbsp;{product.quantity}&nbsp;</p>
                                                                                    <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)} className='d-flex justify-content-center align-items-center bg-success' style={{width:'2.5rem',height:'1.5rem',outline:'none'}}><FaPlus style={{color:'white'}}/></button>

                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div> 
                                                                              

                                                      </div>
                                                      <br/>
                                                </>
                                          ))
                                    ) : (
                                          <div className="empty-state">
                                                <h6>No products found.</h6>
                                                <Image src={noproduct} alt="No products found" />
                                          </div>)
                                    }
                              </div>
                        </div>   

                        <div className='col-sm-4' style={{backgroundColor:'#f1f3f6' }}>                           
                              <div className="cartGrossProfitBox p-3 mt-2 mb-2" style={{backgroundColor:'#fff',borderRadius:'8px'}}>
                                    <p>Order Summary</p>
                                    <hr /> 
                                    <div className='d-flex justify-content-between'>
                                          <p>Overall Price:</p>
                                          <p>₹{parseFloat(orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2))}</p>
                                    </div> 
                                    {discount > 0 && (
                                          <div className='d-flex justify-content-between'>
                                                <p>Discount:</p>
                                                <p> - ₹{((discount / 100) * orderData.products.reduce((sum, product) => sum + product.price * product.quantity,0)).toFixed(2)}</p>
                                          </div>
                                    )}
                                    
                                    <div className='d-flex justify-content-between'>
                                          <p> Total Price:</p>
                                          <p> ₹{( orderData.products.reduce((sum, product) => sum + product.price * product.quantity,0) - ((discount / 100) * orderData.products.reduce((sum, product) => sum + product.price * product.quantity,0))).toFixed(2)}</p>
                                    </div> 
                                    <hr></hr>
                                    <div className='m-1'>
                                          {!deliveryAddress || newAddress.name === '' ? (
                                                <div className='mb-2'>
                                                      <button type="button" className='btn btn-success btn-sm' onClick={handleAddOrChangeAddress}>Add Address</button>
                                                </div>
                                          ) : (
                                                <div className="mb-2">
                                                      <p>{`${deliveryAddress.name}`}</p>
                                                      <p>{`${deliveryAddress.address}`}</p>
                                                      <button  type="button" className='btn btn-success btn-sm' onClick={handleAddOrChangeAddress}>Change Address</button>
                                                      <br></br>
                                                </div>
                                          )}

                                          {showAddressModal && (
                                                <div className="addressModal">
                                                      <div className="form-floating mb-2 ">
                                                            <input type="text" className={`form-control `} id="floatingPassword" placeholder="Name" onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                                                            <label htmlFor="floatingPassword"><CiUser /> Your Name</label>
                                                      </div>

                                                      <div className="form-floating mb-2 ">
                                                            <input type="text" className={`form-control `} id="floatingPassword" placeholder="Your Address" onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                                                            <label htmlFor="floatingPassword"><CiLocationOn />Your Address</label>
                                                      </div>
                                                      <button type="button" className="btn btn-success btn-sm" onClick={() => {handleSaveAddress(); setShowAddressModal(false)}}>Save</button>
                                                </div>
                                          )}
                                    </div>
                                    <hr></hr>
                                    <div className="promoCodeSection m-1">
                                          <select id="promoCode"className="form-select" value={promoCode} onChange={(e) => {setPromoCode(e.target.value); setDiscount(0); }}>
                                                <option value="">Select Promo Code</option>
                                                {promoCodes.map((code) => (
                                                      <option key={code.code} value={code.code}>{code.description}</option>
                                                ))}
                                          </select>
                                          <br />
                                          <button type="button" className={`btn btn-success btn-sm`} onClick={handleApplyPromoCode} disabled={!promoCode ||!promoCodes.some((code) =>code.code === promoCode && orderData.products.reduce((sum, product) => sum + product.price * product.quantity, 0) >= code.minOrderValue) }>
                                                Apply
                                          </button>
                                    </div>

                                    <br/>
                                    {
                                          (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.address || newAddress.name === '' || orderData.products.length === 0) ? (
                                                <button type="button" className={`btn btn-primary w-100`} disabled>Proceed To Payment</button>
                                          ) 
                                          : 
                                          (
                                          <Link href="/payment">
                                                <button type="button" className={`btn btn-primary w-100`}>Proceed To Payment</button>
                                          </Link>
                                          )
                                    }
                              </div>
                        </div>   
                  </div>
            </div>

            <Footer/>
        
    </div>
  );
};

export default CheckoutPage;
