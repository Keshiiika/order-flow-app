"use client"
import React, { useState } from 'react';
import styles from './PaymentPage.module.css'; 
import { CiUser } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import Link from 'next/link';
import { CiCreditCard1 } from "react-icons/ci";
import { SiPaytm } from "react-icons/si";
import { CiWallet } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import Navbar from '../navbar'
import Footer from '../footer';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | ''>('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [upiDetails, setUpiDetails] = useState('');
  const [upiVerificationResult, setUpiVerificationResult] = useState<boolean | null>(null);

  const handlePaymentMethodChange = (method: 'card' | 'upi') => {
    setPaymentMethod(method);
  };

  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails({ ...cardDetails, [field]: value });
  };

  const handleUpiDetailsChange = (value: string) => {
    setUpiDetails(value);
    setUpiVerificationResult(null);
  };

  const handleVerifyUpi = () => {
    const isCorrect = Math.random() < 0.9;
    setUpiVerificationResult(isCorrect);
  };

  
  const handlePaymentSubmit = () => {
    if (paymentMethod === 'upi' && upiVerificationResult) {
      console.log('Payment submitted:', { paymentMethod, upiDetails });
      localStorage.setItem('paymentMethod', paymentMethod);
      window.location.href = '/confirmation';
    }
  };

  return (
    <div className='textforall'>
          <Navbar/>
          <>
          <div className='d-flex justify-content-center justify-content-evenly align-items-center'style={{minHeight:'50vh'}}>
              <div  className='d-flex justify-content-center align-items-center fontbold' style={{minWidth:'15vw',minHeight:'15vw',border:'1px solid black',borderRadius:'16px'}}>  
                  <div className='d-flex align-items-center flex-column'>
                      <CiCreditCard1 size={90} color={'#666'}/>
                      <div>
                          <input type="radio" id="card" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => handlePaymentMethodChange('card')}/>
                          <label htmlFor="card">Card</label>
                      </div>
                  </div> 
              </div>
          
              {/* <div className='d-flex justify-content-center align-items-center' style={{minWidth:'15vw',minHeight:'15vw',border:'1px solid black'}}>
                  <div className='d-flex align-items-center flex-column'>
                      <SiPaytm size={70} color={'#bbb'}/>
                      <p>Wallet</p>
                  </div> 
              </div> */}

              <div className='d-flex justify-content-center align-items-center fontbold' style={{minWidth:'15vw',minHeight:'15vw',border:'1px solid black',borderRadius:'16px'}}>
                  <div className='d-flex align-items-center flex-column'>
                      <CiWallet size={90} color={'#666'}/>
                          <div>
              <input type="radio" id="upi" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => handlePaymentMethodChange('upi')}/>
                <label htmlFor="upi">UPI</label>
              </div>
                  </div> 
              </div>
      {/* 
              <div className='d-flex justify-content-center align-items-center' style={{minWidth:'15vw',minHeight:'15vw',border:'1px solid black'}}>
                  <div className='d-flex align-items-center flex-column'>
                      <CiDeliveryTruck size={70} color={'#bbb'}/>
                      <p>Cash On Delivery</p>
                  </div> 
              </div> */}

          </div>
          { paymentMethod === 'card' && (
              <div className={styles.cardDetails}>
                <div className='fontbolddetails'>Card Details</div>
                <div className="form-floating mx-5 my-2">
                  <input type="text" id="cardNumber" value={cardDetails.cardNumber} placeholder="Name" className={`form-control `} onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}/>
                  <label htmlFor="cardNumber"><CiUser /> Card Number</label>
                </div>
                <div className="form-floating mx-5 my-2">
                  <input type="text" id="expiryDate" value={cardDetails.expiryDate} placeholder="Name" className={`form-control `} onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)} />
                  <label htmlFor="expiryDate"><CiUser /> Expiry Date</label>
                </div>
                <div className="form-floating mx-5 my-2">
                  <input type="text" id="cvv" value={cardDetails.cvv} placeholder="Name" className={`form-control `} onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}/>
                  <label htmlFor="cvv"><CiUser /> CVV</label>
                </div>
              </div>
            )}
                    {paymentMethod === 'upi' && (
                <div className={styles.upiDetails}>
                  <div className='fontbolddetails'>UPI Details</div>
                  <div className="form-floating mx-5 my-2">
                    <input type="text" id="upiId" value={upiDetails} placeholder="Name" className={`form-control `}  onChange={(e) => handleUpiDetailsChange(e.target.value)} />
                    <label htmlFor="upiId"><CiUser /> UPI Details</label>
                    <div className='mt-3'>
                    <button  type="button" className='btn btn-success btn-sm' onClick={handleVerifyUpi}>Verify UPI</button>
                    </div>
                    {upiVerificationResult !== null && (
                      <p>Verification Result: {upiVerificationResult ? 'Correct' : 'Incorrect'}</p>
                    )}
                  </div>
                </div>
              )}
              <div className='m-8 fontboldbutton text-center'>
                {(paymentMethod === '' || (paymentMethod === 'card' && (cardDetails.cardNumber === '' || cardDetails.expiryDate === '' || cardDetails.cvv === '')) ||(paymentMethod === 'upi' && !upiVerificationResult)
                ) ? 
                (<button type="button" className="btn btn-primary w-25" disabled>Submit Payment</button>) 
                : 
                (<button type="button" className="btn btn-primary w-25" onClick={handlePaymentSubmit}> Submit Payment</button>)}
              </div>
          </>
          <Footer/>
    </div>
  );
};

export default PaymentPage;
