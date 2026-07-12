import { useState } from "react"

const MAX_PASSENGERS = 99
const TripAlias = {
    ONE_WAY: 0,
    ROUND_TRIP: 1
}

function PassengerCounter() {
    const [passengers, setPassengers] = useState(1)
    const [trip, setTrip] = useState(TripAlias.ROUND_TRIP)
    
    function minusPassenger() {
        if(passengers <= 1) return

        setPassengers(passengers - 1)
    }

    function plusPassenger() {
        if(passengers > MAX_PASSENGERS) return

        setPassengers(passengers + 1)
    }

    return (
        <div>
            <input 
                type="radio" 
                name="trip" 
                id='round-trip' 
                onChange={() => setTrip(TripAlias.ROUND_TRIP)}
                checked={trip === TripAlias.ROUND_TRIP}
            />
            <label htmlFor="round-trip">Round trip</label>
            <input 
                type="radio" 
                name="trip" 
                id='one-way' 
                onChange={() => setTrip(TripAlias.ONE_WAY)} 
            />
            <label htmlFor="one-way">One way</label>

            <div>
                <button onClick={minusPassenger}>-</button>
                <p>{passengers}</p>
                <button onClick={plusPassenger}>+</button>
            </div>
        </div>
    )
}

export default PassengerCounter