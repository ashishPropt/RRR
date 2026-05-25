const express = require('express');
const router = express.Router();

// GET /api/config
// Returns public configuration values the frontend needs at runtime.
// Credentials (SECRET) are NEVER exposed here — only the client-side key.
router.get('/', (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const mode     = process.env.PAYPAL_MODE || 'sandbox';
  const venmo    = process.env.VENMO_HANDLE || null; // e.g. "@ncabinda"

  res.json({
    paypal: {
      clientId:    clientId || null,          // null = PayPal not configured
      mode,                                   // "sandbox" | "live"
      configured:  !!clientId,
    },
    venmo: {
      handle:      venmo,                     // null = not configured
      configured:  !!venmo,
    },
  });
});

module.exports = router;
