import { useNavigate } from "react-router-dom"
import { addToTickets } from "../../../store/slices/ticketSlice"
import { useAppDispatch } from "../../../store/storeHooks"
import { useAppSelector } from "../../../store/storeHooks"

import type { RailcarType, TrainType } from "../../../types"
import './style.css'
import TrainSchedule from "../TrainSchedule/TrainSchedule"

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


return (
    <div className="train" key={id}>
        {/* Основная информация о поезде */}
        <p className="train-title">{id} - {name}</p>
        <div className="train-subtitle">
            <div>Runs on:</div> 
            <div className="frequency">{frequency}</div>
        </div>
        
        <TrainSchedule train={train}/>

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