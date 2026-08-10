import { useNavigate } from "react-router-dom"
import { addTrainToTicket } from "../../../store/slices/ticketSlice"
import { useAppDispatch } from "../../../store/storeHooks"
import type { RailcarType, TrainType } from "../../../types"
import './style.css'
import TrainSchedule from "../TrainSchedule/TrainSchedule"

type props = {
    train: TrainType
}

function Train ({train}:props) {
    const { id, name, frequency, railcars } = train
    
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    function handleSelectRailcar(railcar:RailcarType){
        dispatch(addTrainToTicket({ 
            trainId: id, 
            railcarName: railcar.name 
        }));
        navigate('/review-booking');
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
                    onClick={() => handleSelectRailcar(rail)}
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