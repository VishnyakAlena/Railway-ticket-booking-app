import { configureStore } from "@reduxjs/toolkit";
import ticketSlice from './slices/ticketSlice'
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        tickets: ticketSlice
    }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch