const express = require('express');
const router = express.Router();

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
router.param('id', tourController.checkID);

router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
