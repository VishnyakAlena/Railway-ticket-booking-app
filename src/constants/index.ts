import type { FoodType, TrainType } from "../types"
import paneerImg from '../assets/images/Paneer-Tikka-Rice-Bowl.jpg'
import tandooriChickenImg from '../assets/images/Grilled-Tandoori-Chicken-with-dry-fruits.jpg'
import parathaCurdImg from '../assets/images/Aloo-Paratha-Curd-Meal-2 pcs.png'

export const PromoCodes = {
    BOOKNOW: 50,
    FIRSTTIME: 20
}

export const TripAlias = {
    ONE_WAY: 0,
    ROUND_TRIP: 1
}

export const Trains: TrainType[] = [
    {   id: 22426,
        info: {
            departure: {
                day: 'Nov 16',
                time: '11:25 pm',
                city: 'New Delhi - NDLS'
            },
            arrival: {
                day: 'Nov 17',
                time: '7:25 am',
                city: 'Lucknow - LJN'
    }
        },
        name: 'VANDE BHARAT',
        frequency: 'Everyday',
        railcars: [
            {
                price: 800,
                available: 48,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 1000,
                available: 6,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            },
            {
                price: 1200,
                available: 36,
                reserved: true,
                name: "1A",
                tarife: "Tatkal"
            }
        ]
    },
    {
        id: 22412,
        info: {
            departure: {
                day: 'Nov 16',
                time: '11:45 pm',
                city: 'New Delhi - NDLS'
            },
            arrival: {
                day: 'Nov 17',
                time: '7:45 am',
                city: 'Lucknow - LJN'
    }
        },
        name: 'ARUNACHAL EXP',
        frequency: 'Everyday',
        railcars: [
            {
                price: 800,
                available: 446,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 1000,
                available: 166,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            },
            {
                price: 1400,
                available: 6,
                reserved: true,
                name: "1A",
                tarife: "Tatkal"
            }
        ]
    },
    {
        id: 12572,
        info: {
            departure: {
                day: 'Nov 16',
                time: '11:50 pm',
                city: 'New Delhi - NDLS'
            },
            arrival: {
                day: 'Nov 17',
                time: '9:50 am',
                city: 'Lucknow - LJN'
    }
        },
        name: 'SHATABDI EXPRESS',
        frequency: 'Everyday',
        railcars: [
            {
                price: 800,
                available: 46,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 1000,
                available: 6,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            }
        ]
    }
]

export const FOOD_MENU: FoodType[] = [
    {
        id: 1,
        image: paneerImg,
        name: "Paneer Tikka Rice \n Bowl - Mini",
        price: 200.00,
    },
    {
        id: 2,
        image: tandooriChickenImg,
        name: "Grilled Tandoori Chicken with dry fruits",
        price: 500.00,
    },
    {
        id: 3,
        image: parathaCurdImg,
        name: "Aloo Paratha Curd Meal (2 pcs)",
        price: 120.00,
    },
        {
        id: 4,
        image: paneerImg,
        name: "Paneer Tikka Rice \n Bowl - Mini",
        price: 200.00,
    },
    {
        id: 5,
        image: tandooriChickenImg,
        name: "Grilled Tandoori Chicken with dry fruits",
        price: 500.00,
    },
    {
        id: 6,
        image: parathaCurdImg,
        name: "Aloo Paratha Curd Meal (2 pcs)",
        price: 120.00,
    },
]