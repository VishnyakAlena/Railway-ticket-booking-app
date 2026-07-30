import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import PassengerCounter from "../HomePage/PassengerCounter/PassengerCounter";
import { useEffect, useState } from "react";
import { TripAlias } from "../../constants";
import type { CityType } from "../../types";
import { setTickets } from "../../store/slices/ticketSlice";
import CityInput from "../HomePage/CityInput/CityInput";
import DayInputs from "../HomePage/DayInputs/DayInputs";
import './style.css'

interface BookingTicketsFormProps {
    isHome: boolean;
}

function BookingTicketsForm({ isHome }: BookingTicketsFormProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { tickets } = useAppSelector(store => store.tickets)

    const parseLocaleDate = (dateStr: string | undefined): Date | null => {
        if (!dateStr) return null;
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            // Конструктор Date принимает: Год, Месяц (от 0 до 11), День
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        return null;
    };

    const [passengers, setPassengers] = useState(tickets?.passengers || 1)
    const [trip, setTrip] = useState(TripAlias.ROUND_TRIP)
    const [departureCity, setDepartureCity] = useState<CityType>(tickets?.departureCity || {name: '', code: ''})
    const [arrivalCity, setArrivalCity] = useState<CityType>(tickets?.arrivalCity || {name: '', code: ''})
    const [departureDay, setDepartureDay] = useState<Date | null>(parseLocaleDate(tickets?.departureDay));
    const [arrivalDay, setArrivalDay] = useState<Date | null>(parseLocaleDate(tickets?.arrivalDay));

    useEffect(() => {
        if (tickets) {
            if (tickets.departureDay) {
                setDepartureDay(parseLocaleDate(tickets.departureDay));
            }
            if (tickets.arrivalDay) {
                setArrivalDay(parseLocaleDate(tickets.arrivalDay));
            }
            if (tickets.departureCity) setDepartureCity(tickets.departureCity);
            if (tickets.arrivalCity) setArrivalCity(tickets.arrivalCity);
            if (tickets.passengers) setPassengers(tickets.passengers);
        }
    }, []); 

    function getTickets() {
        const ticketsData = {
            train: tickets?.train ,
            passengers,
            departureCity,
            arrivalCity,
            departureDay: departureDay?.toLocaleDateString() || '',
            arrivalDay: arrivalDay?.toLocaleDateString() || ''
        }
        dispatch(setTickets(ticketsData))

        if (isHome) {
        navigate('/search-results')
    }
    }

    const isTicketDisabled = !arrivalCity?.name?.trim() || 
                            !departureCity?.name?.trim() || 
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
        <div className="booking-tickets-form" id="plannig">
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
                    isHome={isHome}
                />
                <CityInput 
                    title="Arrival" 
                    city={arrivalCity}
                    setCity={setArrivalCity}
                    isHome={isHome}
                />
            </div>
            <DayInputs 
                departureDay={departureDay}
                setDepartureDay={setDepartureDay}
                arrivalDay={arrivalDay}
                setArrivalDay={setArrivalDay}
                isHome={isHome}
                isArrivalDayActive={trip === TripAlias.ROUND_TRIP}
            />
            <div className={`tooltip-wrapper ticket-tooltip-wrapper ${isHome ? 'white-text' : 'black-text'}`} data-tooltip={ticketTooltipText()}>
                <button className="main-button" onClick={getTickets} disabled={isTicketDisabled}>
                    {isHome ? "Ticket, Please!" : "Apply Changes"}
                </button>
            </div>
        </div>
    )
}

export default BookingTicketsForm