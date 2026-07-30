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

        const passengersCount = tickets?.passengers || 1; // Количество пассажиров

        // Создаем копию вагона, чтобы изменить числовые данные перед отправкой в Redux
        let modifiedRailcar = { ...railcar };

        // СЦЕНАРИЙ 1: Мест достаточно (reserved: false И мест больше или равно числу пассажиров)
        if (!railcar.reserved && railcar.available >= passengersCount) {
            // Уменьшаем количество доступных мест на число пассажиров
            modifiedRailcar.available = railcar.available - passengersCount;
            
            // Если места закончились ровно в ноль, переводим вагон в режим ожидания очереди (WL)
            if (modifiedRailcar.available === 0) {
                modifiedRailcar.reserved = true;
            }
        }

        // СЦЕНАРИЙ 2: Вагон УЖЕ находится в режиме очереди (reserved: true)
        else if (railcar.reserved) {
            // Выводим alert о добавлении всей группы в лист ожидания
            alert(`Notice: No seats available. All ${passengersCount} passengers will be added to the Waiting List (WL).`);
            
            // Увеличиваем очередь на количество пассажиров
            modifiedRailcar.available = railcar.available + passengersCount;
        }

        // СЦЕНАРИЙ 3: Обычные места есть (reserved: false), но их МЕНЬШЕ, чем пассажиров
        else if (!railcar.reserved && railcar.available < passengersCount) {
            // Выводим alert, что мест мало и все уходят в лист ожидания
            alert(`Notice: Only ${railcar.available} seats available for ${passengersCount} passengers. Moving everyone to the Waiting List (WL).`);
            
            // Переводим вагон в статус очереди
            modifiedRailcar.reserved = true;
            
            // Логика: к 0 прибавляются пассажиры (или, если очередь еще пустая, размер очереди равен количеству пассажиров)
            modifiedRailcar.available = passengersCount;
        }


        const value = {
            id,
            name,
            info,
            railcar: modifiedRailcar
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
    
    // Возвращаем красивую строку
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