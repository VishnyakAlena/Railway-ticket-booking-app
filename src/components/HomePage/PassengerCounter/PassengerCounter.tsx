import { TripAlias } from "../../../constants";
import './style.css'
import personIcon from '../../../assets/icons/Person-solid.svg'

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

    const isMinusActive = passengers > 1; 
    const isPlusActive = passengers < MAX_PASSENGERS; 

    return (
        <div className="passenger-counter">
            <div className="radio-option">
                <label htmlFor="round-trip" className="radio-label">
                    <input 
                        type="radio" 
                        name="trip" 
                        id='round-trip' 
                        onChange={() => setTrip(TripAlias.ROUND_TRIP)}
                        checked={trip === TripAlias.ROUND_TRIP}
                    />
                    <span className="custom-radio"></span>
                    Round trip
                </label>
            </div>
            <div className="radio-option">
                <label htmlFor="one-way" className="radio-label">
                    <input 
                        type="radio" 
                        name="trip" 
                        id='one-way' 
                        onChange={() => setTrip(TripAlias.ONE_WAY)} 
                        checked={trip === TripAlias.ONE_WAY}
                    />
                    <span className="custom-radio"></span>
                    One way
                </label>
            </div>

            <div className="counter">
                <img src={personIcon} alt="PersonIcon" />
                <button className="change-counter" onClick={minusPassenger} disabled={!isMinusActive}>
                    <div className="center">
                        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.78 0C0.34 0 0 0.34 0 0.779999C0 1.22 0.34 1.56 0.78 1.56H10.34C10.78 1.56 11.12 1.22 11.12 0.779999C11.12 0.34 10.78 0 10.34 0H4.78H0.78Z" fill="#5E4AE3" />
                        </svg>
                    </div>
                </button>
                <p className="quantity">{passengers}</p>
                <button className="change-counter" onClick={plusPassenger} disabled={!isPlusActive}>
                    <div className="center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.77669 4.77669H0.781641C0.349952 4.77669 0 5.12664 0 5.55833C0 5.99002 0.349952 6.33997 0.781641 6.33997H4.77669V10.335C4.77669 10.7667 5.12664 11.1167 5.55833 11.1167C5.99002 11.1167 6.33997 10.7667 6.33997 10.335V6.33997H10.335C10.7667 6.33997 11.1167 5.99002 11.1167 5.55833C11.1167 5.12664 10.7667 4.77669 10.335 4.77669H6.33997V0.781641C6.33997 0.349952 5.99002 0 5.55833 0C5.12664 0 4.77669 0.349952 4.77669 0.781641V4.77669Z" fill="#5E4AE3" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default PassengerCounter