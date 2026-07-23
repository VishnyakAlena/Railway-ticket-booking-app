import { useEffect, useRef, useState } from "react"
import DateRangeCalendar from "../DateRangeCalendar/DateRangeCalendar"
import calendarIcon from '../../../assets/icons/Calendar.svg'
import './style.css'

type props = {
    departureDay: Date | null;
    setDepartureDay: React.Dispatch<React.SetStateAction<Date | null>>;
    arrivalDay: Date | null;
    setArrivalDay: React.Dispatch<React.SetStateAction<Date | null>>;
    isHome: boolean;
    isArrivalDayActive: boolean;
}

function DayInputs({
    departureDay,
    setDepartureDay,
    arrivalDay,
    setArrivalDay,
    isHome,
    isArrivalDayActive
}:props) {
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDepartureDay(null);
        setArrivalDay(null);
    }, [isArrivalDayActive]);

    const closeCalendarWithAnimation = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimatingOut(false);
        }, 300); // 300ms — длительность анимации в CSS
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                closeCalendarWithAnimation(); // Закрываем календарь
        }
    };
    
    if (isOpen && !isAnimatingOut) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [isOpen, isAnimatingOut]);
    
    const isApplyDisabled = isArrivalDayActive ? !arrivalDay || !departureDay: !departureDay 

    return (
        <div className="days-container">
            <p className={`label ${isHome ? 'white-text' : 'black-text'}`}>Pick your lucky day</p>
            <div className="day-inputs">
                <div className="day-inputs__input" onClick={() => setIsOpen(true)}>
                    {departureDay ? (
                        <p>{departureDay ? new Date(departureDay).toLocaleDateString() : ''}</p>
                    ) : (
                        <div className="date-placeloder">
                            <img src={calendarIcon} alt="Calendar" />
                            <p>Depart</p>
                        </div>
                    )}
                </div>
                <div 
                    className={`day-inputs__input ${!isArrivalDayActive ? '_disabled' : ''}`} 
                    onClick={() => {
                        if (isArrivalDayActive) {
                            setIsOpen(true)
                        }
                    }}
                >
                    {arrivalDay && isArrivalDayActive ? (
                        <p>{arrivalDay ? new Date(arrivalDay).toLocaleDateString() : ''}</p>
                    ) : (
                        <div className="date-placeloder">
                        <img src={calendarIcon} alt="Calendar" />
                        <p>Return</p>
                    </div>
                    )}
                </div>
            </div>

            {(isOpen || isAnimatingOut) && <DateRangeCalendar 
                isArrivalDayActive={isArrivalDayActive}
                isApplyDisabled={isApplyDisabled}
                departureDay={departureDay}
                setDepartureDay={setDepartureDay}
                arrivalDay={arrivalDay}
                setArrivalDay={setArrivalDay}
                ref={calendarRef}
                onApply={closeCalendarWithAnimation} 
                onReset={() => {
                    setDepartureDay(null); 
                    setArrivalDay(null); 
                    {closeCalendarWithAnimation}    
    }}
            />}
        </div>
    )

}

export default DayInputs