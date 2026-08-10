import type { TrainType } from "../../../types"
import './style.css'


type props = {
    train: TrainType
}

function TrainSchedule ({train}:props) {

    const { info } = train;

    // Описываем структуру объекта точки (отправления/прибытия)
    interface TimePoint {
        day: string;
        time: string;
        city: string;
    }

    const getDuration = (departure: TimePoint, arrival: TimePoint): string => {
    // Собираем валидные строки дат для JavaScript (например: "Nov 16, 2026 11:25 pm")
    // Используем текущий или любой фиксированный год, так как нам важна только разница
    const currentYear = new Date().getFullYear();
    
    const depString = `${departure.day}, ${currentYear} ${departure.time}`;
    const arrString = `${arrival.day}, ${currentYear} ${arrival.time}`;
    
    const depTime = new Date(depString).getTime();
    const arrTime = new Date(arrString).getTime();

    // Получаем разницу в минутах
    const diffInMs = arrTime - depTime;
    const totalMinutes = Math.floor(diffInMs / 1000 / 60);
    
    const hours = Math.floor(totalMinutes / 60);
    
    // Возвращаем красивую строку
    return `${hours} hours `;
};

    return (
        <div className="train-info">
            <div className="departure">
                <p className="date">{info.departure.day}</p>
                <div>
                    <p className="time">{info.departure.time}</p>
                    <p className="city">{info.departure.city}</p>
                </div>
            </div>
            <div className="duration-block">
                <p className="duration-text">{getDuration(info.departure, info.arrival)}</p>
            </div>
            <div className="arrival">
                <p className="date">{info.arrival.day}</p>
                <div>
                    <p className="time">{info.arrival.time}</p>
                    <p className="city">{info.arrival.city}</p>
                </div>
            </div>
        </div>
    )

}

export default TrainSchedule