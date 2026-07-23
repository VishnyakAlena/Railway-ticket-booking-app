import { forwardRef, useState } from 'react'
import arrowLeft from '../../../assets/icons/Arrow-left.svg'
import arrowRight from '../../../assets/icons/Arrow-right.svg'
import './style.css'

type props = {
    departureDay: Date | null;
    setDepartureDay: React.Dispatch<React.SetStateAction<Date | null>>;
    arrivalDay: Date | null;
    setArrivalDay: React.Dispatch<React.SetStateAction<Date | null>>;
    onApply: () => void; 
    onReset: () => void;
    isApplyDisabled: boolean;
    isArrivalDayActive: boolean;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
]

const WEEK_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const DateRangeCalendar = forwardRef<HTMLDivElement, props>(({
    departureDay: startDate,
    setDepartureDay: setStartDate,
    arrivalDay: endDate,
    setArrivalDay: setEndDate,
    onApply,
    onReset,
    isApplyDisabled,
    isArrivalDayActive
}, ref) => {


    // Текущая дата определяет левый (первый) месяц. Правый месяц всегда будет +1.
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

    // Вычисляем объект даты для правого (следующего) месяца
    const nextMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    // Вычисляем смещение для первого дня конкретного месяца (0 - Пн, 6 - Вс)
    const getFirstDayOffset = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    };
    
    // Генерируем массив дней для переданного месяца
    const getMonthData = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const totalDays = daysInMonth(year, month);

        const daysArray: Date[] = [];
        for (let i = 1; i <= totalDays; i++) {
            daysArray.push(new Date(year, month, i));
        }
        return daysArray;
    };

    // Перелистывание смещает календарь на 1 месяц вперед/назад
    const handlePrevMonth = () => {
        setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
    };

    // Очистка времени для корректного сранвения дат в милисекундах
    const resetTime = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    };

    const handleDateClick = (clickedDate: Date) => {

        if (!startDate || (startDate && endDate || !isArrivalDayActive)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (resetTime(clickedDate) < resetTime(startDate)) {
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
        }
    };

    const isDateInRange = (day: Date) => {
        if (!startDate || !endDate) return false;
        const dateTime = resetTime(day);
        return dateTime >= resetTime(startDate) && dateTime <= resetTime(endDate);
    };

    const isSameDay = (date1: Date, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return date1.toDateString() === date2.toDateString();
    };

    // Рендеринг сетки для одного конкретного месяца
    const renderMonthGrid = (date: Date) => {
        const offset = getFirstDayOffset(date);
        const monthDays = getMonthData(date);

    

        return (
        <div>
            {/* Сетка дней */}
            <div className='calendar-days'>
                {WEEK_NAMES.map((day, index) => (
                    <div className='calendar-week-day' key={`${day}-${index}`}>
                        {day}
                    </div>
                ))}

                {/* Пустые ячейки для выравнивания первой недели */}
                {Array.from({ length: offset }).map((_, index) => (
                    <div key={`empty-${index}`}/>
                ))}

                {/* Дни месяца */}
                {monthDays.map((dayObj) => {
                    const isStart = isSameDay(dayObj, startDate);
                    const isEnd = isSameDay(dayObj, endDate);
                    const inRange = isDateInRange(dayObj);

                    let dayClass = 'calendar-day';

                    if (isStart || isEnd) {
                        dayClass += ' is-boundary';
                    } 

                    if (startDate && endDate) {

                        if (inRange) {
                            dayClass += ' is-in-range'; // Класс применится и к дням внутри, и к самим границам!
                        }
                        if (isStart) {
                            dayClass += ' is-start-edge';
                        }
                        if (isEnd) {
                            dayClass += ' is-end-edge';
                        }
                    }
                    
                    
                
                    return (
                        <div
                            key={dayObj.toISOString()}
                            onClick={() => handleDateClick(dayObj)}
                            className={dayClass}
                        >
                            {dayObj.getDate()}
                        </div>
                );
                })}
            </div>
        </div>
    );
    };

    // Главный рендер компонента (двухстраничный календарь)
    return (
        <div ref={ref} className="month-calendar-container">
            {/* Панель управления (стрелки) */}
            <div className='calendar-header'>
                <button className='calendar-arrow' onClick={handlePrevMonth}>
                    <img src={arrowLeft} alt="Previous Month" />
                </button>

                <div className="calendar-header-months">
                    <div className="calendar-header-month-title">
                        {MONTH_NAMES[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                    </div>
                    <div className="calendar-header-month-title">
                        {MONTH_NAMES[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}
                    </div>
                </div>


                <button className='calendar-arrow' onClick={handleNextMonth}>
                    <img src={arrowRight} alt="Next Month" />
                </button>
            </div>

            {/* Контейнер для двух месяцев */}
            <div className="calendar-container">
                <div style={{ flex: 1 }}>{renderMonthGrid(currentMonthDate)}</div>
                <div style={{ flex: 1 }}>{renderMonthGrid(nextMonthDate)}</div>
            </div>
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
    {/* Пустой блок-распорка занимает место первого месяца */}
    <div style={{ flex: 1 }}></div> 
    
    {/* Кнопки внутри пространства второго месяца */}
    <div className='calendar-buttons' style={{ flex: 1, display: 'flex', gap: '10px'}}>
        <button className="reset-calendar-button" onClick={onReset} disabled={!startDate}>Reset</button>
        <button className="apply-calendar-button" onClick={onApply} disabled={isApplyDisabled}>Apply</button>
    </div>
</div>
    </div>
    );
})

export default DateRangeCalendar