import * as Yup from 'yup';
import { RelationType } from '../../utils/enum';

const phoneRegex = /^\+91\d{10}$/;
const pincodeRegex = /^\d{6}$/;

export const emergencyContactSchema = Yup.object({
    name: Yup.string().required('Name is required').max(50),
    relation: Yup.string().oneOf(Object.values(RelationType)).required('Relation is required'),
    phoneNumber: Yup.string().matches(phoneRegex, 'Must start with +91 and contain 10 digits').required('Phone number is required'),
});

export const addressSchema = Yup.object({
    addressLine1: Yup.string().required('Address line 1 is required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().matches(pincodeRegex, 'Pincode must be a 6-digit number').required('Pincode is required'),
});

export const phoneValidator = Yup.string().matches(phoneRegex, 'Must start with +91 and contain 10 digits');
