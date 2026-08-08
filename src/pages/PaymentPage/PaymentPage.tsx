import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../store/storeHooks"
import './style.css'
import BoardingDetails from "../../components/BoardingDetails/BoardingDetails"
import TravellerDetails from "../../components/TravellerDetails/TravellerDetails"

function PaymentPage () {
    const navigate = useNavigate()
    const {price} = useAppSelector(store => store.tickets)

    function goToSuccess(){
            navigate('/success')
        }

        function goToReview(){
            navigate('/review-booking')
        }

    function isPaymentInfo() {

    }

    return (
        <div className="payment-page">
            <h2>Pay <span className="total-price">₹{price.total}</span> to confirm booking</h2>
            <div className="boarding-details-wrapper card">
                <BoardingDetails />
                <TravellerDetails />
            </div>




            <div className="buttons-block">
                <div className="buttons-info">Discounts, offers and price concessions will be applied later during payment</div>
                <div className="tooltip-wrapper passengers-info-tooltip-wrapper" data-tooltip={!isPaymentInfo ? 'Please fill payment info' : ''}>
                    <button className="main-button book-now-btn" onClick={goToSuccess} disabled={!isPaymentInfo}>Book Now</button>
                </div>
                <button className="cancel-button book-now-btn" onClick={goToReview}>Cancel</button>
            </div>
        </div>
    )
}

export default PaymentPage