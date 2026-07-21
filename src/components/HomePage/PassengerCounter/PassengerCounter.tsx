import { TripAlias } from "../../../constants";
import './style.css'

const MAX_PASSENGERS = 99


type props = {
    passengers: number;
    setPassengers: React.Dispatch<React.SetStateAction<number>>;
    trip: number;
    setTrip: React.Dispatch<React.SetStateAction<number>>;
}

function PassengerCounter({
    passengers,
    setPassengers,
    trip,
    setTrip
}: props) {
        
    function minusPassenger() {
        if(passengers <= 1) return

        setPassengers(passengers - 1)
    }

    function plusPassenger() {
        if(passengers > MAX_PASSENGERS) return

        setPassengers(passengers + 1)
    }

    return (
        <div className="passenger-counter">
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

            <div className="counter">
                <button onClick={minusPassenger}>-</button>
                <p>{passengers}</p>
                <button onClick={plusPassenger}>+</button>
            </div>
        </div>
    )
}

export default PassengerCounter