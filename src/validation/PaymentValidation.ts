import * as Yup from "yup";

export interface CardFormValues {
    cardNumber: string;
    expirationDate: string;
    cardholder: string;
    cvc: string;
}

export const initialCardValues: CardFormValues = {
    cardNumber: "",
    expirationDate: "",
    cardholder: "",
    cvc: ""
};

export const creditCardValidationSchema = Yup.object().shape({
    cardNumber: Yup.string()
        .required("Card number is required")
        .matches(/^\d{16}$/, "Must be exactly 16 digits"),
    expirationDate: Yup.string()
        .required("Required")
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Use MM/YY format"),
    cardholder: Yup.string()
        .required("Cardholder name is required")
        .min(3, "Too short"),
    cvc: Yup.string()
        .required("Required")
        .matches(/^\d{3}$/, "Must be 3 digits")
});