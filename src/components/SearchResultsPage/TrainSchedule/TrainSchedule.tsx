import { useAppSelector } from "../../../store/storeHooks";
import type { TrainType } from "../../../types"
import './style.css'


type props = {
    train: TrainType
}

function TrainSchedule ({train}:props) {

    const { info } = train;
    const { tickets } = useAppSelector(store => store.tickets);

    const parseReduxDate = (dateStr: string | undefined): Date | null => {
        if (!dateStr) return null;
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Месяцы в JS начинаются с 0
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        return null;
    };

    const formatToShortText = (date: Date | null, defaultText: string): string => {
        if (!date) return defaultText;
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(date); // Превращает в строку вида "Nov 16"
    };

    const departureDateObj = parseReduxDate(tickets?.departureDay);

    let arrivalDateObj: Date | null = null;
    if (departureDateObj) {
        arrivalDateObj = new Date(departureDateObj.getTime());
        arrivalDateObj.setDate(arrivalDateObj.getDate() + 1); // Автоматически прибавляет 1 день
    }

    const displayDepartureDay = formatToShortText(departureDateObj, info.departure.day);
    const displayArrivalDay = formatToShortText(arrivalDateObj, info.arrival.day);

    const getDuration = (departureTimeStr: string, arrivalTimeStr: string): string => {
        const timeToMinutes = (timeStr: string): number => {
            const match = timeStr.match(/^(\d+):(\d+)\s*(am|pm)$/i);
            if (!match) return 0;
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const ampm = match[3].toLowerCase();

            if (ampm === 'pm' && hours < 12) hours += 12;
            if (ampm === 'am' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        const depMinutes = timeToMinutes(departureTimeStr);
        let arrMinutes = timeToMinutes(arrivalTimeStr);

        if (arrMinutes < depMinutes) {
            arrMinutes += 24 * 60; // Если время прибытия меньше, значит наступил следующий день (+24 часа)
        }

        const totalMinutes = arrMinutes - depMinutes;
        const hours = Math.floor(totalMinutes / 60);
        return `${hours} hours`;
    };

    return (
        <div className="train-info">
            <div className="departure">
                <p className="date">{displayDepartureDay}</p>
                <div>
                    <p className="time">{info.departure.time}</p>
                    <p className="city">{info.departure.city}</p>
                </div>
            </div>
            <div className="duration-block">
                <p className="duration-text">{getDuration(info.departure.time, info.arrival.time)}</p>
            </div>
            <div className="arrival">
                <p className="date">{displayArrivalDay}</p>
                <div>
                    <p className="time">{info.arrival.time}</p>
                    <p className="city">{info.arrival.city}</p>
                </div>
            </div>
        </div>
    )

}

export default TrainSchedule