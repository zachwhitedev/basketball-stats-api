'use strict';

const pool = require('../db');
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')('sk_test_CpBKkhC8c5M48737aLhg4cO7');

// https://stripe.com/docs/payments/accept-a-payment#web

// https://stripe.com/docs/billing/subscriptions/cards

exports.handler = async (event) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 199,
    currency: 'usd',
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: 'accept_a_payment' },
  });
  const response = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: {
      clientsecret: paymentIntent.client_secret
    }
  };
  return response;
};
