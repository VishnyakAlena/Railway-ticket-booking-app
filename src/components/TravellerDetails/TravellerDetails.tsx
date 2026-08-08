import { useAppSelector } from '../../store/storeHooks';
import './style.css'

function TravellerDetails() {

    const { passengersData, tickets } = useAppSelector(store => store.tickets);
    const firstPassenger = passengersData[0];
    const currentFoodList = tickets?.food || [];

    return (
        <div className="traveller-details">
            <h3>Traveller Details</h3>
            {firstPassenger ? (
                    <div className="traveller-details-info">
                        <div className="traveller-details-info-row">
                            <div>{firstPassenger.fullName}</div>
                            <div>{firstPassenger.birthDate}</div>
                        </div>
                        <div className="traveller-details-info-row">
                            <div>Extra Baggage</div>
                            <div>{(tickets?.extraBaggage === true) ? '1' : '0'}</div>
                        </div>
                        {currentFoodList.length > 0 ? (
                            currentFoodList.map((food, index) => (
                                <div className="bill-details-info-row" key={index}>
                                    <div>{food.name}</div>
                                    <div>{food.counter}</div>
                                </div>
                                ))
                                ) : (
                                <div className="bill-details-info-row">
                                    <div>Food:</div>
                                    <div>0</div>
                                </div>
                        )}
                        <div className="traveller-details-info-row traveller-email">
                            <div>E-Tickets will be sent to:</div>
                            <div>{firstPassenger.email}</div>
                        </div>
                    </div>
                ) : (
                    <div className="error-text">No passenger data available.</div>
                )}
        </div>
    )
}

export default TravellerDetails