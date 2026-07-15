import CityInput from "../../components/HomePage/CityInput"
import PassengerCounter from "../../components/HomePage/PassengerCounter"
import DayInputs from "../../components/HomePage/DayInputs"
import { useState } from "react"
import { TripAlias } from "../../constants"
import type { CityType } from "../../types"

function HomePage() {

    const [passengers, setPassengers] = useState(1)
    const [trip, setTrip] = useState(TripAlias.ROUND_TRIP)
    const [departureCity, setDepartureCity] = useState<CityType>({name: '', code: ''})
    const [arrivalCity, setArrivalCity] = useState<CityType>({name: '', code: ''})
    const [departureDay, setDepartureDay] = useState<Date | null>(null);
    const [arrivalDay, setArrivalDay] = useState<Date | null>(null);

    function getTickets() {
        const tickets = {
            passengers,
            departureCity,
            arrivalCity,
            departureDay,
            arrivalDay
        }
        console.log(tickets)
    }

    return (
        <div>
            <h1>Let's Find That Ticket</h1>
            <p>Before Someone Else Does</p>
            <PassengerCounter
                passengers={passengers}
                setPassengers={setPassengers}
                trip={trip}
                setTrip={setTrip}
            />
            <div style={{display:"flex", justifyContent: 'space-between'}}>
                <CityInput 
                    title="Departure" 
                    isActive={true}
                    city={departureCity}
                    setCity={setDepartureCity}
                />
                <CityInput 
                    title="Arrival" 
                    isActive={trip === TripAlias.ROUND_TRIP}
                    city={arrivalCity}
                    setCity={setArrivalCity}
                />
            </div>
            <DayInputs 
                departureDay={departureDay}
                setDepartureDay={setDepartureDay}
                arrivalDay={arrivalDay}
                setArrivalDay={setArrivalDay}

            />
            <button onClick={getTickets}>Ticket, Please!</button>
        </div>
    )
}

export default HomePage