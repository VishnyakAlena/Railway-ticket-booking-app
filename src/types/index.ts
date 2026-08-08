export type CityType = {
    name: string,
    code: string
}

export type TrainInfo = {
    departure: {
        day: string,
        time: string,
        city: string
    },
    arrival: {
        day: string,
        time: string,
        city: string
    }
}

export type TrainType = {
    id: number,
    name: string,
    frequency: string,
    info: TrainInfo, 
    railcars: RailcarType[]
}

export type RailcarType = {
    available: number,
    reserved: boolean,
    name: string,
    price: number,
    tarife: string
}

export type PassengerType = {
    name: string,
    email: string,
    phone: string,
    dateBirth: string
}

export type FoodType = {
    id: number,
    image: string;
    name: string,
    price: number,
    counter: number
}

export type TicketTrainType = {
    id: number,
    name: string,
    info: TrainInfo, 
    railcar: RailcarType
}

export type TicketType = {
    passengers: number,
    passengersDetails?: PassengerDetailsType[],
    departureCity: CityType,
    arrivalCity: CityType,
    departureDay: string,
    arrivalDay: string,
    train?: TicketTrainType,
    passengerData?: PassengerType[],
    food?: FoodType[],
    extraBaggage?: boolean,
    promoCode?: string
}

export type PriceType = {
    tickets: number,
    food: number,
    baggage: number, 
    tax: number,
    discount?: number,
    total?: number
}

export type PassengerDetailsType = {
    fullName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
};