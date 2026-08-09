import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PassengerDetailsType, PriceType, TicketType } from "../../types";
import { PromoCodes, Tax } from "../../constants";
import type { CardFormValues } from "../../validation/PaymentValidation";

interface ITicketState {
    tickets: TicketType | null,
    price: PriceType,
    passengersData: PassengerDetailsType[],
    paymentMethod: number,
    cardDetails: CardFormValues
}

export interface IPayload {
    value: TicketType[keyof TicketType],
    key: string
}

const initialState:ITicketState = {
    tickets: null,
    price: {
        tickets: 0,
        food: 0,
        baggage: 0, 
        tax: 0,
        discount: 0,
        total: 0
    },
    passengersData: [],
    paymentMethod: 1,
    cardDetails: {
        cardNumber: '',
        expirationDate: '',
        cardholder: '',
        cvc: ''
    }
}

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setTickets: (state, action: PayloadAction<TicketType>) => {
            state.tickets = action.payload
        },
        addToTickets: (state, action: PayloadAction<IPayload>) => {
            const newTickets = {
                ...state.tickets,
                [action.payload.key] : action.payload.value
            }

            const ticketsPrice = (newTickets.passengers || 0) * (newTickets.train?.railcar.price || 0)
            const foodPrice = newTickets.food?.reduce((acc, food) => {
                return acc += food.counter * food.price
            }, 0) || 0

            let newPrice: PriceType = {
                tickets: ticketsPrice,
                food: foodPrice,
                baggage: newTickets.extraBaggage ? 500 : 0,
                tax: Tax
            }
            
            const total = Object.values(newPrice).reduce((acc, value) => {
                return acc += value
            }, 0)
        
            let sale = 0
            if (newTickets.promoCode) {
                sale = PromoCodes[(newTickets.promoCode as keyof typeof PromoCodes)] || 0
            }
            console.log('sale', sale);

            const discountPrice = (sale / 100) * total

            newPrice = {
                ...newPrice,
                discount: discountPrice,
                total: total - discountPrice
            }

            state.price = newPrice
            state.tickets = newTickets as TicketType
        },
        setPassengersData: (state, action: PayloadAction<PassengerDetailsType[]>) => {
            state.passengersData = action.payload;
        },
        setCardDetails: (state, action: PayloadAction<CardFormValues>) => {
            state.cardDetails = action.payload; // cardDetails инициализируйте в initialState
        },
        setPaymentMethod: (state, action: PayloadAction<number>) => {
            state.paymentMethod = action.payload;
        }
    }
})

export const {setTickets, addToTickets, setPassengersData, setCardDetails, setPaymentMethod} = ticketSlice.actions
export default ticketSlice.reducer