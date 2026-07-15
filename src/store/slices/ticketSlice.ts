import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TicketType } from "../../types";

interface ITicketState {
    tickets: TicketType | null,
    price: number,
    totalPrice: number
}

const initialState:ITicketState = {
    tickets: null,
    price: 0,
    totalPrice: 0
}

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setTickets: (state, action: PayloadAction<TicketType>) => {
            state.tickets = action.payload
        },
        addToTickets: (state, action: PayloadAction<TicketType>) => {
            const newTickets = {
                ...state.tickets,
                ...action.payload
            }
            state.tickets = newTickets
        }
    }
})

export const {setTickets} = ticketSlice.actions
export default ticketSlice.reducer