export type CityType = {
    name: string,
    code: string
}

export type TrainType = {
    price: number,
    id: string,
    name: string,
    place: number
}

export type PassengerType = {
    name: string,
    email: string,
    phone: string,
    dateBirth: string
}

export type FoodType = {
    id: number,
    name: string,
    price: number,
    counter: number
}

export type TicketType = {
    passengers: number,
    departureCity: CityType,
    arrivalCity: CityType,
    departureDay: string,
    arrivalDay: string,
    train?: TrainType[],
    passengerData?: PassengerType[],
    food?: FoodType[],
    extraBaggage?: boolean,
    promoCode?: number
}