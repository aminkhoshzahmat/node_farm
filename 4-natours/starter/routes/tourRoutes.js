const express = require('express');

const router = express.Router();
const { protectAuth, restrictTo } = require('../controllers/authController');

/**
 * We can also use destructure pattern to use their exact name like > {createTour, getTour,...}
 */
const tourController = require('../controllers/tourController');

/**
 * Param middleware listen to params, for example here we are listening for id in tour routes.
 * This type of middleware has 4th param
 *
 * router.param('id', (req, res, next, val) => {
 *   console.log(`## This is logged from tourRoutes.js with param middleware & id is: ${val}`);
 *   next();
 * });
 */
// router.param('id', tourController.checkID);

/**
 * Top 5 cheap tour, with getAllTours manipulated
 */
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

/**
 * Aggregate examples
 */
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(protectAuth, tourController.getAllTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(protectAuth, restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
