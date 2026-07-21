import { useState } from "react"
import DateRangeCalendar from "../DateRangeCalendar/DateRangeCalendar"
import calendarIcon from '../../../assets/icons/Calendar.svg'
import './style.css'

type props = {
    departureDay: Date | null;
    setDepartureDay: React.Dispatch<React.SetStateAction<Date | null>>;
    arrivalDay: Date | null;
    setArrivalDay: React.Dispatch<React.SetStateAction<Date | null>>;
}

function DayInputs({
    departureDay,
    setDepartureDay,
    arrivalDay,
    setArrivalDay
}:props) {
    const [isOpen, setIsOpen] = useState(false)

    function openCalendar() {
        setIsOpen(prev => !prev)
    }

    return (
        <div>
            <p>Pick your lucky day</p>
            <div className="day-inputs" style={{display:"flex", justifyContent: 'space-between'}}>
                <div className="day-inputs__input">
                    <div onClick={openCalendar}>
                        <img src={calendarIcon} alt="Calendar" />
                        <p>Depart</p>
                    </div>
                    <p>{departureDay ? new Date(departureDay).toLocaleDateString() : ''}</p>
                </div>
                <div className="day-inputs__input">
                    <div onClick={openCalendar}>
                        <img src={calendarIcon} alt="Calendar" />
                        <p>Return</p>
                    </div>
                    <p>{arrivalDay ? new Date(arrivalDay).toLocaleDateString() : ''}</p>
                </div>
            </div>

            {isOpen && <DateRangeCalendar 
                departureDay={departureDay}
                setDepartureDay={setDepartureDay}
                arrivalDay={arrivalDay}
                setArrivalDay={setArrivalDay}
            />}
        </div>
    )

}

export default DayInputs