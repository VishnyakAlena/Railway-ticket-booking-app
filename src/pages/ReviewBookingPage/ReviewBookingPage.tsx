import { useEffect } from "react"
import { useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"

function ReviewBookingPage(){
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
            <h2>Review your booking</h2>
            
            <button onClick={goToReview} disabled={!tickets?.train}>Tickets Please!</button>
        </div>
    )
}

export default ReviewBookingPage