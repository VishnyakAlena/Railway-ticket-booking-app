import { useNavigate } from "react-router-dom"
import { addToTickets } from "../../store/slices/ticketSlice"
import { useAppDispatch } from "../../store/storeHooks"
import { useAppSelector } from "../../store/storeHooks"

import type { RailcarType, TrainType } from "../../types"
import './style.css'

type props = {
    train: TrainType
}

function Train ({train}:props) {
    const { id, name, info, frequency, railcars } = train
    
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {tickets} = useAppSelector(store => store.tickets)

    function addTrainToTicket(railcar:RailcarType){

        if(railcar.reserved || railcar.available < (tickets?.passengers || 0)) {
            console.log('Количество мест меньше, чем пассажиров')
            return
        }

        const value = {
            id,
            name,
            info,
            railcar
        }

        const payload = {
            key: 'train',
            value
        }

        dispatch(addToTickets(payload))
        
        console.log('New tickets', {tickets})

        navigate('/review-booking')
        
    }

    function getAvailableText(reserved: boolean) {
        return reserved ? 'WL' : 'Avl'
    }

    function getBackground(railName: string) {
        let color = '#7DCFB6'

        switch (railName) {
            case '1A':
                color = '#F79256'
                break;
            case '2A':
                color = '#FBD1A2'
                break;
            case '3A':
                color = '#7DCFB6'
                break;
        }

        return color
    }

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
    
    // Возвращаем красивую строку (например: "8h 0m")
    return `${hours} hours `;
};

return (
    <div className="train" key={id}>
        {/* Основная информация о поезде */}
        <p className="train-title">{id} - {name}</p>
        <div className="train-subtitle">
            <div>Runs on:</div> 
            <div className="frequency">{frequency}</div>
        </div>
        {/* Расписание: отправление и прибытие */}
        <div className="train-info">
        <div className="departure">
            <p className="date">{info.departure.day}</p>
            <p className="time">{info.departure.time}</p>
            <p className="city">{info.departure.city}</p>
        </div>
            <div className="duration-block">
                <p className="duration-text">{getDuration(info.departure, info.arrival)}</p>
            </div>
            <div className="arrival">
                <p className="date">{info.arrival.day}</p>
                <p className="time">{info.arrival.time}</p>
                <p className="city">{info.arrival.city}</p>
            </div>
        </div>
        {/* Список вагонов этого конкретного поезда */}
        <div className="railcars-container">
            {railcars.map((rail) => (
                <div 
                    key={rail.name} 
                    className="railcar-card"
                    style={{ background: getBackground(rail.name) }}
                    onClick={() => addTrainToTicket(rail)}
                >
                    <div className="railcar-info">
                        <p className="railcar-name">{rail.name}</p>
                        <p className="railcar-status">
                            {getAvailableText(rail.reserved)} - {rail.available}
                        </p>
                    </div>
                <div className="railcar-price-block">
                    <p className="railcar-tarife">{rail.tarife}</p>
                    <p className="railcar-price">₹{rail.price}</p>
                </div>
            </div>
        ))}
            </div>
        </div>
    );
};


export default Train