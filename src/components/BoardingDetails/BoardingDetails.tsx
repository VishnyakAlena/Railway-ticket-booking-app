import { useAppSelector } from "../../store/storeHooks"
import type { TrainType } from "../../types"
import TrainSchedule from "../SearchResultsPage/TrainSchedule/TrainSchedule"
import './style.css'

interface StylesProps {
    className?: string; 
}

function BoardingDetails({className = ''}: StylesProps) {
    const {tickets} = useAppSelector(store => store.tickets)

    return (
            <div className="boarding-details">
                <h3 className={`train-class ${className}`}>Boarding Details</h3>
                {tickets?.train ? (
                    <>
                        <div className="train-info train-title-info">
                            <div className="train-title">{tickets?.train?.id} - {tickets?.train?.name}</div>
                            <div className={`train-class ${className}`}>Class {tickets?.train?.railcar?.name} & {tickets?.train?.railcar?.tarife} Quota</div>
                        </div>
                        {tickets?.train && <TrainSchedule train={tickets?.train as unknown as TrainType} />}
                    </>
                ) : (
                    <div className="error-text">No train data available.</div>
                )}
            </div>
    )
}

export default BoardingDetails