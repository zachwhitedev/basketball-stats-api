'use strict';

const pool = require('../db');
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

// https://stripe.com/docs/payments/accept-a-payment#web

// https://stripe.com/docs/billing/subscriptions/cards

exports.handler = async (event) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 399,
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
