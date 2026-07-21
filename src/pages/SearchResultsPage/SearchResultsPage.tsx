import { useEffect } from "react"
import { useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { Trains } from "../../constants"
import Train from "../../components/SearchResultsPage/Train"

function SearchResultsPage(){
    const navigate = useNavigate()
    const {tickets} = useAppSelector(store => store.tickets)

    function goToReview(){
        navigate('/review-booking')
    }

useEffect(() => {
    console.log(tickets);

    if(!tickets) navigate('/')

}, [])

    return (
        <div>
            <h2>Search Results</h2>
            {Trains.map(train => <Train key={train.id} train={train}/>)}
            <button onClick={goToReview} disabled={!tickets?.train}>Tickets Please!</button>
        </div>
    )
}

export default SearchResultsPage