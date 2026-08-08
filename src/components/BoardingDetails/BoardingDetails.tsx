import { useAppSelector } from "../../store/storeHooks"
import type { TrainType } from "../../types"
import TrainSchedule from "../SearchResultsPage/TrainSchedule/TrainSchedule"
import './style.css'

function BoardingDetails() {
    const {tickets} = useAppSelector(store => store.tickets)

    return (
            <div className="boarding-details">
                <h3>Boarding Details</h3>
                <div className="train-info train-title-info">
                    <div className="train-title">{tickets?.train?.id} - {tickets?.train?.name}</div>
                    <div className="train-class">Class {tickets?.train?.railcar?.name} & {tickets?.train?.railcar?.tarife} Quota</div>
                </div>
                {tickets?.train && <TrainSchedule train={tickets?.train as unknown as TrainType} />}
            </div>
    )
}

export default BoardingDetails