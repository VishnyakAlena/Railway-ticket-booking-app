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
    
    const isApplyDisabled = isArrivalDayActive ? !arrivalDay || !departureDay: !departureDay 
    const [activeField, setActiveField] = useState<'depart' | 'return' | null>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                closeCalendarWithAnimation();
                setActiveField(null)
            }
        };

            const body = document.body;
            const isMainPage = body.classList.contains('home-page-active') || isHome;

            if (isMainPage) {
                if (isOpen) {
                    body.style.overflowY = 'auto';
                } else {
                    body.style.overflowY = 'hidden';
                    window.scrollTo({ top: 0 });
                }
            }

            if (isOpen && !isAnimatingOut) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                if (isMainPage) {
                    body.style.overflowY = '';
                }
            };
    }, [isOpen, isAnimatingOut, isHome]);


    return (
        <div className="days-container">
            <p className={`label ${isHome ? 'white-text' : 'black-text'}`}>Pick your lucky day</p>
            <div className="day-inputs">
                <div className={`day-inputs__input ${activeField === 'depart' ? '_focused' : ''}`} 
                onClick={() => setIsOpen(true)}>
                    {departureDay ? (
                        <p>{departureDay ? new Date(departureDay).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                    ) : (
                        <div className="date-placeloder">
                            <img src={calendarIcon} alt="Calendar" />
                            <p>Depart</p>
                        </div>
                    )}
                </div>
                <div 
                    className={`day-inputs__input ${!isArrivalDayActive ? '_disabled' : ''} ${(activeField === 'return' && isArrivalDayActive) ? '_focused' : ''}`} 
                    onClick={() => {
                        if (isArrivalDayActive) setIsOpen(true)
                        }}>
                    {arrivalDay && isArrivalDayActive ? (
                        <p>{arrivalDay ? new Date(arrivalDay).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                    ) : (
                        <div className="date-placeloder">
                        <img src={calendarIcon} alt="Calendar" />
                        <p>Return</p>
                    </div>
                    )}
                </div>
            </div>



            {(isOpen || isAnimatingOut) && (<div className={`calendar-animation-wrapper ${isOpen ? '_fade-in' : '_fade-out'}`}>

                <DateRangeCalendar 
                isArrivalDayActive={isArrivalDayActive}
                isApplyDisabled={isApplyDisabled}
                departureDay={departureDay}
                setDepartureDay={setDepartureDay}
                arrivalDay={arrivalDay}
                setArrivalDay={setArrivalDay}
                setActiveField={setActiveField}
                ref={calendarRef}
                onApply={() => {
                    closeCalendarWithAnimation();
                }}
                onReset={() => {
                    setDepartureDay(null); 
                    setArrivalDay(null); 
                    closeCalendarWithAnimation();    
    }}
            />
            </div>)}

            
        </div>
    )

}

export default DayInputs