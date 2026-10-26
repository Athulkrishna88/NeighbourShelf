const express = require('express');
const router = express.Router();
const {
  requestLoan,
  getLoans,
  approveLoan,
  declineLoan,
  cancelLoan,
  markReturned,
  addRating,
  getLoanRatings
} = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', requestLoan);
router.get('/', getLoans);
router.patch('/:id/approve', approveLoan);
router.patch('/:id/decline', declineLoan);
router.patch('/:id/cancel', cancelLoan);
router.patch('/:id/return', markReturned);
router.post('/:id/ratings', addRating);
router.get('/:id/ratings', getLoanRatings);

module.exports = router;
