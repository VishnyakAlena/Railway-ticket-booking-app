import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { addToTickets } from "../../store/slices/ticketSlice"

function ReviewBookingPage(){
    const navigate = useNavigate()
    const {tickets, price} = useAppSelector(store => store.tickets)
    const [code, setCode] = useState('')
    const dispatch = useAppDispatch()

    function goToReview(){
        navigate('/review-booking')
    }

    function applyCode(){
        dispatch(addToTickets({
            key: 'promoCode',
            value: code
        }))
    }

    function addBaggage(){
        dispatch(addToTickets({
            key: 'extraBaggage',
            value: true
        }))
    }

useEffect(() => {
    if(!tickets) navigate('/')
}, [])

    return (
        <div>
            <h2>Review your booking</h2>
            
            <input 
                type="text" 
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            {code && <button onClick={applyCode}>Apply code</button>}
            <div>
                <p>Extra Baggage</p>
                <button onClick={addBaggage}>Add to Ticket</button>
            </div>
            <div>
                <p>Bill details</p>
                <p>Base Ticket Fare: ₹{price.tickets}</p>
                <p>Paneer Tikka Rice Bowl - Mini: ₹{price.food}</p>
                <p>Extra Baggage: ₹{price.baggage}</p>
                <p>CGST & SGST: ₹500.00</p>
                <p>Discount: ₹{price.discount}</p>
                <p>Total Charge: ₹{price.total}</p>
            </div>

            <button onClick={goToReview} disabled={!tickets?.train}>Book Now</button>
        </div>
    )
}

export default ReviewBookingPage