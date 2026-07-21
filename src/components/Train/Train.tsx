import { addToTickets } from "../../store/slices/ticketSlice"
import { useAppDispatch } from "../../store/storeHooks"
import { useAppSelector } from "../../store/storeHooks"

import type { RailcarType, TrainType } from "../../types"

type props = {
    train: TrainType
}

function Train ({train}:props) {
    const { id, name, info, railcars } = train
    
    const dispatch = useAppDispatch()
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
        
    }

    function getInfo(){
        return Object.values(info)
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
        <div>
            <p>{id} - {name}</p>
            <p>Runs on: Everyday</p>
            {getInfo().map((item, ind) => <div key={ind}>
                <p>{item.day}</p>
                <p>{item.time}</p>
                <p>{item.city}</p>
            </div>)}
            {railcars.map(rail => <div 
                                    key={rail.name} 
                                    style={{background: getBackground(rail.name)}}
                                    onClick={() => addTrainToTicket(rail)}
                                    >
                <div>
                    <p>{rail.name}</p>
                    <p>{getAvailableText(rail.reserved)} - {rail.available}</p>
                </div>
                <div>
                    <p>{rail.tarife}</p>
                    <p>₹{rail.price}</p>
                </div>
            </div>)}
        </div>
    )
}

export default Train