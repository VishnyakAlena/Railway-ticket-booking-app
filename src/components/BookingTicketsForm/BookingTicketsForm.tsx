import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/storeHooks";
import PassengerCounter from "../HomePage/PassengerCounter/PassengerCounter";
import { useState } from "react";
import { TripAlias } from "../../constants";
import type { CityType } from "../../types";
import { setTickets } from "../../store/slices/ticketSlice";
import CityInput from "../HomePage/CityInput/CityInput";
import DayInputs from "../HomePage/DayInputs/DayInputs";
import './style.css'

function BookingTicketsForm() {
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

    const isTicketDisabled = !arrivalCity.name || 
                            !departureCity.name || 
                            departureCity.name.toLowerCase() === arrivalCity.name.toLowerCase() ||
                            (trip === TripAlias.ROUND_TRIP ? (!departureDay || !arrivalDay) : !departureDay)

    return (
        <div className="booking-tickets-form">
            <PassengerCounter
                passengers={passengers}
                setPassengers={setPassengers}
                trip={trip}
                setTrip={setTrip}
            />
            <div className="cities-container">
                <CityInput 
                    title="Departure" 
                    city={departureCity}
                    setCity={setDepartureCity}
                    isHome={true}
                />
                <CityInput 
                    title="Arrival" 
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
                isHome={true}
                isArrivalDayActive={trip === TripAlias.ROUND_TRIP}
            />
            <button className="main-button" onClick={getTickets} disabled={isTicketDisabled}>Ticket, Please!</button>
        </div>
    )
}

export default BookingTicketsForm