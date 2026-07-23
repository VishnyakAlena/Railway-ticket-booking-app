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

    const ticketTooltipText = () => {
    if (!departureCity.name && !arrivalCity.name) {
        return "Please fill in the departure and arrival stations";
    } 
        else if (!departureCity.name) {
            return "Please fill in the departure station";
        }
            else if (!arrivalCity.name) {
                return "Please fill in the arrival station";
            }
                else if (departureCity.name.toLowerCase() === arrivalCity.name.toLowerCase()) {
                    return "The departure station is the same as the arrival station";
                }
    if (!departureDay && !arrivalDay) {
        return "Please fill in the departure and arrival dates";
    } 
        else if (!departureDay) {
            return "Please select a departure date";
        }
            else if (trip === TripAlias.ROUND_TRIP && !arrivalDay) {
                return "Please select an arrival date";
            }

    return "";
};

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
            <div className="tooltip-wrapper ticket-tooltip-wrapper" data-tooltip={ticketTooltipText()}>
                <button className="main-button" onClick={getTickets} disabled={isTicketDisabled}>Ticket, Please!</button>
            </div>
        </div>
    )
}

export default BookingTicketsForm