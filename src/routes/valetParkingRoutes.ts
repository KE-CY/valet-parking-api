import express from 'express';
import { upload } from '../config/multer-config';
import { getList, getOneById, getValetParkingMembership, handOverKey, setPaid, setParkingSpot, setReserved, setReturned, valetParkingRegister, valetParkingScan } from '../controllers/valetParkingController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { pathParamByIdValidation, valetParkingMembershipValidation, valetParkingRegisterValidation, valetParkingReservedValidation, valetParkingSpotValidation } from '../middlewares/valetParkingMiddleware';

const router = express.Router();

router.get('/membership', authenticateJWT, valetParkingMembershipValidation, getValetParkingMembership);
router.get('/', authenticateJWT, getList);
router.get('/:id', authenticateJWT, pathParamByIdValidation, getOneById);

router.post('/scan', authenticateJWT, upload.single('image'), valetParkingScan,);
router.post('/register', authenticateJWT, valetParkingRegisterValidation, valetParkingRegister);

router.put('/:id/parkingSpot', authenticateJWT, pathParamByIdValidation, valetParkingSpotValidation, setParkingSpot,);
router.put('/:id/reserved', authenticateJWT, pathParamByIdValidation, valetParkingReservedValidation, setReserved);
router.put('/:id/handOverKey', authenticateJWT, pathParamByIdValidation, handOverKey);
router.put('/:id/returned', authenticateJWT, pathParamByIdValidation, setReturned);
router.put('/:id/paid', authenticateJWT, pathParamByIdValidation, setPaid);

export default router;
