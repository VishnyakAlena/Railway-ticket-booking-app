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
    {
        id: 22426,
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
        railcars: [
            {
                price: 100,
                available: 33,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 200,
                available: 6,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            },
            {
                price: 250,
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
                time: '11:25 pm',
                city: 'New Delhi - NDLS'
            },
            arrival: {
                day: 'Nov 17',
                time: '7:25 am',
                city: 'Lucknow - LJN'
    }
        },
        name: 'ARUNACHAL EXP',
        railcars: [
            {
                price: 100,
                available: 33,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 200,
                available: 6,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            },
            {
                price: 250,
                available: 36,
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
                time: '11:25 pm',
                city: 'New Delhi - NDLS'
            },
            arrival: {
                day: 'Nov 17',
                time: '7:25 am',
                city: 'Lucknow - LJN'
    }
        },
        name: 'SHATABDI EXPRESS',
        railcars: [
            {
                price: 100,
                available: 33,
                reserved: false,
                name: "3A",
                tarife: "Tatkal"
            },
            {
                price: 200,
                available: 6,
                reserved: false,
                name: "2A",
                tarife: "Tatkal"
            }
        ]
    }
]