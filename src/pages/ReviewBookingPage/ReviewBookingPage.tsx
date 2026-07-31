import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { addToTickets } from "../../store/slices/ticketSlice"
import './style.css'
import PassengerCard from "../../components/PassengerCard/PassengerCard"
import type { PassengerDetailsType, TrainType } from "../../types"
import TrainSchedule from "../../components/SearchResultsPage/TrainSchedule/TrainSchedule"
import { FOOD_MENU } from "../../constants"

const getInitialVisibleCount = () => {
    return window.innerWidth <= 768 ? 1 : 3;
};

function ReviewBookingPage(){
        const navigate = useNavigate()
        const {tickets, price} = useAppSelector(store => store.tickets)

        const passengerCount = tickets?.passengers || 1;

        // Инициализируем стейт строго под структуру вашего типа PassengerDetailsType
        const [passengersList, setPassengersList] = useState<PassengerDetailsType[]>(
            Array(passengerCount).fill(null).map(() => ({
                fullName: '',
                phoneNumber: '',
                email: '',
                birthDate: ''
            }))
        );

        const handlePassengerUpdate = (index: number, field: keyof PassengerDetailsType, value: string) => {
            const updatedList = [...passengersList];
            updatedList[index] = {
                ...updatedList[index],
                [field]: value
            };
            setPassengersList(updatedList);
        };

        const isAllPassengersInfo = passengersList.every(passenger => 
            passenger.fullName.trim() !== '' &&
            passenger.phoneNumber.trim() !== '' &&
            passenger.email.trim() !== '' &&
            passenger.birthDate.trim() !== ''
        );

        const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());
        const isFullyExpanded = visibleCount === FOOD_MENU.length;

    // 3. Добавляем слушатель изменения экрана, чтобы стейт подстраивался при повороте телефона
    useEffect(() => {
        const handleResize = () => {
            // Если меню НЕ раскрыто полностью кнопкой, то подстраиваем базовое количество под экран
            if (visibleCount !== FOOD_MENU.length) {
                setVisibleCount(window.innerWidth <= 768 ? 1 : 3);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [visibleCount]);
        const visibleFood = FOOD_MENU.slice(0, visibleCount);
        const handleShowMore = () => {
            setVisibleCount(FOOD_MENU.length); 
        };
        const handleShowLess = () => {
            setVisibleCount(window.innerWidth <= 768 ? 1 : 3); 
        };


        const [code, setCode] = useState('')
        const dispatch = useAppDispatch()

        function goToReview(){
            navigate('/payment')
        }

        function goToSearch(){
            navigate('/search-results')
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
    }, [tickets, navigate])


    return (
        <div className="review-booking">
            <h2>Review your booking</h2>
            <div className="boarding-details card">
                <h3>Boarding Details</h3>
                <div className="train-info">
                    <div className="train-title">{tickets?.train?.id} - {tickets?.train?.name}</div>
                    <div className="train-class">Class {tickets?.train?.railcar?.name} & {tickets?.train?.railcar?.tarife} Quota</div>
                </div>
                {tickets?.train && <TrainSchedule train={tickets.train as unknown as TrainType} />}
            </div>
            <div>{tickets?.train?.railcar?.reserved ? 'Wish list - WL' : 'Available carriges - Avl'} - {tickets?.train?.railcar?.available}</div>
            <div className="passenger-cards-block">
                {passengersList.map((passenger, index) => (
                        <PassengerCard 
                            key={index}
                            index={index}
                            passenger={passenger}
                            onInputChange={(field, value) => handlePassengerUpdate(index, field, value)}
                        />
                    ))}
            </div>
            <div className="food-menu-wrapper">
                <div className={`food-menu-block ${isFullyExpanded ? '_expanded' : ''}`}>
                    {visibleFood.map((food) => (
                        <div className="food-block" key={food.id}>
                            <img src={food.image} alt={food.name} className="food-image" />
                            <div className="food-info card">
                                <p className="food-name">{food.name}</p>
                                <p className="food-price">₹{food.price}</p>
                                <button className="food-button">Add to ticket</button>
                            </div>
                        </div>
                    ))}
                    <div className="toggle-menu-btn-wrapper">
                    {visibleCount < FOOD_MENU.length ? (
                        <button 
                            type="button" 
                            className="show-menu" 
                            onClick={handleShowMore}
                        >
                            View more &gt;
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            className="show-menu" 
                            onClick={handleShowLess}
                        >
                            &lt; View Less
                        </button>
                    )}
                </div>
                </div>
            </div>





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

            <div className="buttons-block">
                <button className="main-button" onClick={goToReview} disabled={!isAllPassengersInfo || !tickets?.train}>Book Now</button>
                <button className="cancel-button" onClick={goToSearch}>Cancel</button>
            </div>
        </div>
    )
}

export default ReviewBookingPage