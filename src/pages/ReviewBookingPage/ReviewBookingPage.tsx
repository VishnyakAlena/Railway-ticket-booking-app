import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { addToTickets, setPassengersData } from "../../store/slices/ticketSlice"
import './style.css'
import PassengerCard from "../../components/PassengerCard/PassengerCard"
import { FOOD_MENU } from "../../constants"
import BoardingDetails from "../../components/BoardingDetails/BoardingDetails"
import { useFormik } from "formik"
import { bookingValidationSchema } from "../../validation/PassengerCardValidation"
import BillDetailsWithPromocodeAndExtraBaggage from "../../components/BillDetailsWithPromocodeAndExtraBaggage/BillDetailsWithPromocodeAndExtraBaggage"

const getInitialVisibleCount = () => {
    return window.innerWidth <= 768 ? 1 : 3;
};

function ReviewBookingPage(){
        const navigate = useNavigate()
        const dispatch = useAppDispatch()
        const {tickets, passengersData} = useAppSelector(store => store.tickets)

        const passengerCount = tickets?.passengers || 1;
        const savedPassengers = useMemo(() => passengersData || [], [passengersData]);
        const formik = useFormik({
            initialValues: useMemo(() => {
                // Создаем массив строго той длины, которую пользователь выбрал на первой странице
                const passengers = Array(passengerCount).fill(null).map((_, index) => {
                    // Если для этого индекса уже есть сохраненные данные в Редаксе — берем их
                    if (savedPassengers[index]) {
                        return savedPassengers[index];
                    }
                    // Если данных нет (пользователь увеличил количество) — создаем пустые поля
                    return {
                        fullName: '',
                        phoneNumber: '',
                        email: '',
                        birthDate: ''
                    };
                });

                return { passengers };
            }, [savedPassengers, passengerCount]),
            enableReinitialize: true, 
            validationSchema: bookingValidationSchema,
            validate: (values) => {
                const isEmptyForm = values.passengers.every(p => !p.fullName && !p.phoneNumber);
                const hasSavedData = savedPassengers.length > 0;
                
                if (isEmptyForm && hasSavedData) {
                    return; // Просто выходим, не затирая Redux
                }

                // Если пользователь реально что-то пишет, сохраняем в Redux
                dispatch(setPassengersData(values.passengers));
            },
            onSubmit: () => {
                navigate('/payment');
            },
        });
        const isFormValid = formik.isValid;
        const isFormFilled = formik.dirty || savedPassengers.length > 0;

        const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());
        const isFullyExpanded = visibleCount === FOOD_MENU.length;

        // Добавляем слушатель изменения экрана, чтобы стейт подстраивался при повороте телефона
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

        const currentFoodList = tickets?.food || [];
        
        // Создаем функцию обработки клика
        function handleAddFood(foodItem: typeof FOOD_MENU[0]) {
            // Проверяем, есть ли уже блюдо с таким id в корзине
            const existingFoodIndex = currentFoodList.findIndex(item => item.id === foodItem.id);
            let updatedFoodList;

            if (existingFoodIndex > -1) {
                // Если блюдо НАЙДЕНО, создаем новый массив и увеличиваем counter конкретно у него
                updatedFoodList = currentFoodList.map((item, index) => 
                index === existingFoodIndex 
                    ? { ...item, counter: item.counter + 1 } 
                    : item
                );
            } else {
                // Если блюдо НЕ найдено, добавляем его в массив и выставляем counter: 1
                updatedFoodList = [...currentFoodList, { ...foodItem, counter: 1 }];
            }

            // Отправляем обновленный массив в Redux (ваш ticketSlice сам всё пересчитает)
            dispatch(addToTickets({ 
                key: 'food', 
                value: updatedFoodList 
            }));
        }

        // Функция уменьшения количества (кнопка минус)
        function handleDecreaseFood(foodId: number | string) {
        const updatedFoodList = currentFoodList.map(item => {
            if (item.id === foodId) {
            // Уменьшаем counter, но не позволяем упасть ниже 1
            return { ...item, counter: Math.max(1, item.counter - 1) };
            }
            return item;
        });

        dispatch(addToTickets({ key: 'food', value: updatedFoodList }));
        }

        // Функция полного удаления блюда (кнопка Remove)
        function handleRemoveFood(foodId: number | string) {
        // Фильтруем массив, исключая удаляемое блюдо
        const updatedFoodList = currentFoodList.filter(item => item.id !== foodId);
        
        dispatch(addToTickets({ key: 'food', value: updatedFoodList }));
        }


    function goToSearch(){
        navigate('/search-results')
    }

    useEffect(() => {
        if(!tickets) navigate('/')
    }, [tickets, navigate])

    return (
        <div className="review-booking">
            <h2>Review your booking</h2>
            <div className="boarding-details-wrapper card">
                <BoardingDetails />
            </div>
            <form id="passengers-info-form" onSubmit={formik.handleSubmit}>
                <div className="passenger-cards-block">
                    {formik.values.passengers.map((_, index) => (
                            <PassengerCard 
                                key={index}
                                index={index}
                                formik={formik}
                            />
                        ))}
                </div>
            </form>
            <div className="food-menu-wrapper">
                <div className={`food-menu-block ${isFullyExpanded ? '_expanded' : ''}`}>
                    {visibleFood.map((food) => {
                        const addedFood = currentFoodList.find(item => item.id === food.id);
                        return (
                            <div className="food-block" key={food.id}>
                            <img src={food.image} alt={food.name} className="food-image" />
                            <div className="food-info card">
                                <p className="food-name">{food.name}</p>
                                <p className="food-price">₹{food.price}</p>
                                {addedFood ? (
                                        <div className="food-controls">
                                            <div className="counter-wrapper">
                                                <button 
                                                    className="change-counter" 
                                                    onClick={() => handleDecreaseFood(food.id)}
                                                    disabled={addedFood.counter <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="quantity">{addedFood.counter}</span>
                                                <button 
                                                    className="change-counter" 
                                                    onClick={() => handleAddFood(food)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button 
                                                className="cancel-button food-remove-btn" 
                                                onClick={() => handleRemoveFood(food.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="food-button" 
                                            onClick={() => handleAddFood(food)}
                                        >
                                            Add to ticket
                                        </button>
                                    )}
                            </div>
                        </div>
                        )

                    })}

                    <div className="toggle-menu-btn-wrapper">
                    {visibleCount < FOOD_MENU.length ? (
                        <button 
                            className="show-menu" 
                            onClick={handleShowMore}
                        >
                            View more &gt;
                        </button>
                    ) : (
                        <button 
                            className="show-menu" 
                            onClick={handleShowLess}
                        >
                            &lt; View Less
                        </button>
                    )}
                </div>
                </div>
            </div>

            <BillDetailsWithPromocodeAndExtraBaggage />

            <div className="buttons-block">
                <div className="buttons-info">Discounts, offers and price concessions will be applied later during payment</div>
                    <div className="tooltip-wrapper passengers-info-tooltip-wrapper" data-tooltip={(!isFormValid || !isFormFilled) ? 'Please fill paseengers info' : ''}>
                        <button className="main-button book-now-btn" 
                            type="submit"
                            form="passengers-info-form"
                            disabled={!isFormValid || !isFormFilled}
                        >
                            Book Now
                        </button>
                    </div>
                    <button className="cancel-button book-now-btn" onClick={goToSearch}>Cancel</button>
                    <div className="buttons-info buttons-info-links">
                        <div>Cancellation Policy</div>
                        <div>Terms & Conditions</div>
                        <div>Travel Insurance</div>
                    </div>
                </div>
        </div>
    )
}

export default ReviewBookingPage