import type { TrainType } from "../types"

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