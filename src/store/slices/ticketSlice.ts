import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FoodType, PassengerDetailsType, PriceType, TicketType, TrainType } from "../../types";
import { PromoCodes, Tax, Trains } from "../../constants";

interface ITicketState {
    trains: TrainType[];
    tickets: TicketType,
    price: PriceType,
    passengersData: PassengerDetailsType[],
    paymentMethod: number,
    currentFoodList: FoodType[]
}

export interface IPayload {
    value: TicketType[keyof TicketType],
    key: string
}

const initialState:ITicketState = {
    trains: Trains,
    tickets: {
        train: undefined,
        passengers: 1,
        extraBaggage: false,
        departureCity: {name: '', code: ''},
        arrivalCity: {name: '', code: ''},
        departureDay: '',
        arrivalDay: ''
    },
    price: {
        tickets: 0,
        food: 0,
        baggage: 0, 
        tax: 0,
        discount: 0,
        total: 0
    },
    passengersData: [],
    currentFoodList: [],
    paymentMethod: 1,
}

const calculatePrice = (tickets: TicketType): PriceType => {
    const ticketsPrice = (tickets.passengers || 0) * (tickets.train?.railcar.price || 0);
    const foodPrice = tickets.food?.reduce((acc, food) => acc + food.counter * food.price, 0) || 0;

    const basePrice: PriceType = {
        tickets: ticketsPrice,
        food: foodPrice,
        baggage: tickets.extraBaggage ? 500 : 0,
        tax: Tax,
        discount: 0,
        total: 0
    };

    const totalWithoutDiscount = basePrice.tickets + basePrice.food + basePrice.baggage + basePrice.tax;

    let sale = 0;
    if (tickets.promoCode) {
        sale = PromoCodes[(tickets.promoCode as keyof typeof PromoCodes)] || 0;
    }

    const discountPrice = (sale / 100) * totalWithoutDiscount;

    return {
        ...basePrice,
        discount: discountPrice,
        total: totalWithoutDiscount - discountPrice
    };
};

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setTickets: (state, action: PayloadAction<TicketType>) => {
            state.tickets = action.payload;
            state.price = calculatePrice(state.tickets);
        },
        addToTickets: (state, action: PayloadAction<IPayload>) => {
            const newTickets = {
                ...state.tickets,
                [action.payload.key] : action.payload.value
            }
            
            state.price = calculatePrice(newTickets as TicketType)
            state.tickets = newTickets as TicketType
        },
        addTrainToTicket: (state, action: PayloadAction<{ trainId: string; railcarName: string }>) => {
            const passengersCount = state.tickets?.passengers || 1;
            
            // 1. Находим конкретный поезд в сохраненном массиве Redux
            const targetTrain = state.trains.find(t => t.id === action.payload.trainId);
            if (!targetTrain) return;

            // 2. Находим нужный вагон в этом поезде
            const targetRailcar = targetTrain.railcars?.find(r => r.name === action.payload.railcarName);
            if (!targetRailcar) return;

            // 3. Ваша математическая логика списания мест (мутируем стейт напрямую)
            if (!targetRailcar.reserved && targetRailcar.available >= passengersCount) {
                targetRailcar.available -= passengersCount; // Места уменьшаются в Redux!
                
                if (targetRailcar.available === 0) {
                    targetRailcar.reserved = true;
                }
            } 
            else if (targetRailcar.reserved) {
                targetRailcar.available += passengersCount; // Добавляем в Waiting List
                alert(`Notice: No seats available. All ${passengersCount} passengers will be added to the Waiting List (WL).`);
            } 
            else if (!targetRailcar.reserved && targetRailcar.available < passengersCount) {
                targetRailcar.reserved = true;
                targetRailcar.available = passengersCount;
                alert(`Notice: Only ${targetRailcar.available} seats available for ${passengersCount} passengers. Moving everyone to the Waiting List (WL).`);
            }

            // 4. Записываем измененный поезд в текущий выбранный билет
            state.tickets.train = {
                id: targetTrain.id,
                name: targetTrain.name,
                info: targetTrain.info,
                railcar: {
                    available: targetRailcar.available,
                    reserved: targetRailcar.reserved,
                    name: targetRailcar.name,
                    price: targetRailcar.price,
                    tarife: targetRailcar.tarife
                }
            };
            state.price = calculatePrice(state.tickets);
        },
        setPassengersData: (state, action: PayloadAction<PassengerDetailsType[]>) => {
            state.passengersData = action.payload;
        },
        setPaymentMethod: (state, action: PayloadAction<number>) => {
            state.paymentMethod = action.payload;
        },
        clearCurrentBooking: (state) => {
            // Возвращаем дефолтные пустые значения для заказа
            state.price = { total: 0, tickets: 0, baggage: 0, tax: 0, discount: 0, food: 0};
            state.paymentMethod = 1; 
            state.passengersData = []; 
            state.currentFoodList = []; 
            
            // Поле tickets (где лежит текущий выбранный поезд для этого заказа) тоже обнуляем
            state.tickets = {
                train: undefined,
                passengers: 1,
                extraBaggage: false,
                departureCity: {name: '', code: ''}, // Обнуляем город отправления
                arrivalCity: {name: '', code: ''},   // Обнуляем город прибытия
                departureDay: '',  // Обнуляем дату отправления
                arrivalDay: '',
            }
        }
    }
})

export const {setTickets, addToTickets, addTrainToTicket, setPassengersData, setPaymentMethod, clearCurrentBooking} = ticketSlice.actions
export default ticketSlice.reducer