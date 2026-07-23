import './style.css'
import BookingTicketsForm from "../../components/BookingTicketsForm/BookingTicketsForm"

function HomePage() {
    

    return (
        <div className="home-page">
            <h1>Let's Find That Ticket</h1>
            <p className="white-text main-paragraph">before someone else does</p>
            <BookingTicketsForm isHome={true} />
        </div>
    )
}

export default HomePage