import { useState } from 'react'
import arrowLeft from '../../../assets/icons/Arrow-left.svg'
import arrowRight from '../../../assets/icons/Arrow-right.svg'
import calendarIcon from '../../../assets/icons/Calendar.svg'
import './style.css'

type props = {
    departureDay: Date | null;
    setDepartureDay: React.Dispatch<React.SetStateAction<Date | null>>;
    arrivalDay: Date | null;
    setArrivalDay: React.Dispatch<React.SetStateAction<Date | null>>;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
]

const WEEK_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function DateRangeCalendar({
    departureDay: startDate,
    setDepartureDay: setStartDate,
    arrivalDay: endDate,
    setArrivalDay: setEndDate
}:props) {
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
        if (!startDate || (startDate && endDate)) {
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
        return dateTime > resetTime(startDate) && dateTime < resetTime(endDate);
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
            {/* Заголовок месяца */}
            <h4 style={{margin: '0 0 15px 0', textAlign: 'center'}}>
                {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
            </h4>

            {/* Сетка дней */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
                {WEEK_NAMES.map(day => (
                    <div key={day} style={{ fontWeight: 'bold', padding: '5px 0', color: '#666', fontSize: '13px' }}>
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

                    let background = 'transparent';
                    let color = '#000';
                    let borderRadius = '0';

                    if (isStart || isEnd) {
                        background = '#007bff';
                        color = '#fff';
                        borderRadius = '50%';
                    }

                    else if (inRange) {
                        background = '#e6f2ff';
                        color = '#000'
                    }
                
                    return (
                        <div
                            key={dayObj.toISOString()}
                            onClick={() => handleDateClick(dayObj)}
                            style={{
                                    background,
                                    color,
                                    borderRadius,
                                    padding: '8px 0',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    fontSize: '14px'
                                }}
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
        <div className="calendar-container" style={{ background: '#fff', fontFamily: 'Arial, sans-serif', width: '600px', margin: '20px auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            {/* Панель управления (стрелки) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={arrowLeft} alt="Previous Month" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <img src={calendarIcon} alt="Calendar" />
                    <span>Select Dates</span>
                </div>
                <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={arrowRight} alt="Next Month" />
                </button>
            </div>

            {/* Контейнер для двух месяцев */}
            <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{ flex: 1 }}>{renderMonthGrid(currentMonthDate)}</div>
                <div style={{ flex: 1 }}>{renderMonthGrid(nextMonthDate)}</div>
            </div>

            {/* Информационная плашка с выбранными датами */}
            {(startDate || endDate) && (
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#333' }}>
                    <strong>Start:</strong> {' '}
                    {startDate ? startDate.toLocaleDateString() : '...'} {' '}
                    <strong>End:</strong> {' '}
                    {endDate ? endDate.toLocaleDateString() : '...'}
                </div>
            )}
        </div>
    );
}

export default DateRangeCalendar