import CityInput from "../../components/HomePage/CityInput/CityInput"
import PassengerCounter from "../../components/HomePage/PassengerCounter/PassengerCounter"
import DayInputs from "../../components/HomePage/DayInputs/DayInputs"
import { useState } from "react"
import { TripAlias } from "../../constants"
import type { CityType } from "../../types"
import { useAppDispatch } from "../../store/storeHooks"
import { setTickets } from "../../store/slices/ticketSlice"
import { useNavigate } from "react-router-dom"
import './style.css'

function HomePage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

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
            departureDay: departureDay?.toLocaleDateString() || '',
            arrivalDay: arrivalDay?.toLocaleDateString() || ''
        }
        dispatch(setTickets(tickets))

        navigate('/search-results')
    }

    return (
        <div className="home-page">
            <h1>Let's Find That Ticket</h1>
            <p className="white-text main-paragraph">before someone else does</p>
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
                    isHome={true}
                />
                <CityInput 
                    title="Arrival" 
                    isActive={trip === TripAlias.ROUND_TRIP}
                    city={arrivalCity}
                    setCity={setArrivalCity}
                    isHome={true}
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