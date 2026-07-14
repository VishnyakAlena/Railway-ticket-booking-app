import DateRangeCalendar from "../../components/DateRangeCalendar/DateRangeCalendar"
import CityInput from "../../components/HomePage/CityInput"
import PassengerCounter from "../../components/HomePage/PassengerCounter"

function HomePage() {

    return (
        <div>
            <h1>Let's Find That Ticket</h1>
            <p>Before Someone Else Does</p>
            <PassengerCounter/>
            <CityInput title="Departure" isActive={true}/>
            <CityInput title="Arrival" isActive={false}/>
            <DateRangeCalendar/>
        </div>
    )
}

export default HomePage