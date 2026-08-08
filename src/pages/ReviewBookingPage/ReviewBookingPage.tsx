import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { addToTickets, setPassengersData } from "../../store/slices/ticketSlice"
import './style.css'
import PassengerCard from "../../components/PassengerCard/PassengerCard"
import { FOOD_MENU, PromoCodes } from "../../constants"
import BoardingDetails from "../../components/BoardingDetails/BoardingDetails"
import { useFormik } from "formik"
import { bookingValidationSchema } from "../../validation/PassengerCardValidation"

const getInitialVisibleCount = () => {
    return window.innerWidth <= 768 ? 1 : 3;
};

function ReviewBookingPage(){
        const navigate = useNavigate()
        const dispatch = useAppDispatch()
        const {tickets, price, passengersData} = useAppSelector(store => store.tickets)

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

        const [code, setCode] = useState('')

        function goToSearch(){
            navigate('/search-results')
        }
    
        useEffect(() => {
            // Очищаем пробелы и переводим в верхний регистр для надежности проверки
            const cleanedCode = code.trim().toUpperCase();

            // Проверяем, есть ли введенный код в списке валидных промокодов
            if (PromoCodes.hasOwnProperty(cleanedCode)) {
                dispatch(addToTickets({
                    key: 'promoCode',
                    value: cleanedCode // Отправляем валидный код
                }));
            } else {
                // Если инпут пустой или код неверный — сбрасываем промокод в хранилище
                dispatch(addToTickets({
                    key: 'promoCode',
                    value: '' 
                }));
            }
        }, [code, dispatch]); 

        const isBooknowApplied = code.trim().toUpperCase() === Object.keys(PromoCodes)[0];
        const isFirsttimeApplied = code.trim().toUpperCase() === Object.keys(PromoCodes)[1];

        function addBaggage(){
            dispatch(addToTickets({
                key: 'extraBaggage',
                value: true
            }))
        }

        function removeBaggage(){
            dispatch(addToTickets({
                key: 'extraBaggage',
                value: false
            }))
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

            <div className="offers-card card">
                <h4 className="promocode-title">Offers</h4>
                <div className="promocode-offer-row">
                    <div className="promocode-offer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.7609 9.99999L19.8663 8.08969C19.9991 7.85986 20.0352 7.58667 19.9667 7.33021C19.8982 7.07374 19.7306 6.85499 19.5008 6.72205L17.5885 5.61672V3.41407C17.5885 3.14854 17.483 2.89388 17.2953 2.70612C17.1075 2.51835 16.8529 2.41287 16.5873 2.41287H14.3857L13.2813 0.501575C13.148 0.272216 12.9296 0.104604 12.6736 0.0350146C12.5466 0.000589099 12.4141 -0.00828766 12.2836 0.00889877C12.1532 0.0260852 12.0274 0.0689931 11.9137 0.135135L10.0014 1.24046L8.08911 0.134134C7.85915 0.00137182 7.58588 -0.034606 7.3294 0.0341144C7.07292 0.102835 6.85424 0.270625 6.72146 0.500574L5.61614 2.41287H3.41449C3.14896 2.41287 2.8943 2.51835 2.70654 2.70612C2.51877 2.89388 2.41329 3.14854 2.41329 3.41407V5.61572L0.500992 6.72105C0.386887 6.78668 0.286876 6.87421 0.206703 6.97862C0.126531 7.08302 0.0677781 7.20224 0.0338202 7.32942C-0.000137754 7.4566 -0.00863139 7.58923 0.00882726 7.71971C0.0262859 7.85018 0.0693526 7.97591 0.135553 8.08969L1.24088 9.99999L0.135553 11.9103C0.00338332 12.1403 -0.0324765 12.4133 0.0357919 12.6697C0.10406 12.9261 0.27092 13.1451 0.499991 13.2789L2.41229 14.3843V16.5859C2.41229 16.8514 2.51777 17.1061 2.70553 17.2939C2.8933 17.4816 3.14796 17.5871 3.41349 17.5871H5.61614L6.72146 19.4994C6.8101 19.6509 6.93666 19.7768 7.08868 19.8645C7.24071 19.9523 7.41296 19.999 7.58851 20C7.76272 20 7.93592 19.9539 8.09011 19.8648L10.0004 18.7595L11.9127 19.8648C12.1426 19.9974 12.4157 20.0334 12.6721 19.9649C12.9285 19.8964 13.1472 19.729 13.2803 19.4994L14.3847 17.5871H16.5863C16.8519 17.5871 17.1065 17.4816 17.2943 17.2939C17.482 17.1061 17.5875 16.8514 17.5875 16.5859V14.3843L19.4998 13.2789C19.6137 13.2131 19.7135 13.1255 19.7936 13.021C19.8736 12.9166 19.9322 12.7974 19.9662 12.6703C20.0001 12.5432 20.0087 12.4107 19.9914 12.2803C19.974 12.1499 19.9312 12.0241 19.8653 11.9103L18.7609 9.99999ZM7.4974 4.98396C7.89583 4.98409 8.2779 5.1425 8.55954 5.42433C8.84118 5.70616 8.99933 6.08833 8.9992 6.48677C8.99907 6.8852 8.84066 7.26727 8.55883 7.54891C8.277 7.83055 7.89483 7.9887 7.4964 7.98857C7.09796 7.98844 6.7159 7.83003 6.43425 7.5482C6.15261 7.26637 5.99446 6.8842 5.99459 6.48576C5.99472 6.08733 6.15313 5.70526 6.43496 5.42362C6.71679 5.14198 7.09896 4.98383 7.4974 4.98396ZM7.79776 14.5955L6.19583 13.3951L12.203 5.38544L13.805 6.58589L7.79776 14.5955ZM12.5034 14.996C12.3061 14.9959 12.1108 14.957 11.9285 14.8814C11.7463 14.8059 11.5807 14.6952 11.4413 14.5556C11.3018 14.4161 11.1912 14.2504 11.1158 14.0681C11.0403 13.8858 11.0015 13.6905 11.0016 13.4932C11.0017 13.2959 11.0406 13.1006 11.1162 12.9183C11.1917 12.7361 11.3024 12.5705 11.442 12.431C11.5815 12.2916 11.7472 12.181 11.9295 12.1055C12.1118 12.0301 12.3071 11.9913 12.5044 11.9914C12.9028 11.9915 13.2849 12.1499 13.5666 12.4317C13.8482 12.7136 14.0063 13.0957 14.0062 13.4942C14.0061 13.8926 13.8477 14.2747 13.5658 14.5563C13.284 14.838 12.9018 14.9961 12.5034 14.996Z" fill="#5E4AE3"/>
                        </svg>
                        <span>50% off up to ₹100 | Use code BOOKNOW</span>
                    </div>
                    <button 
                        className={`promocode-apply-btn ${!isBooknowApplied ? '' : 'promocode-remove-btn'}`}  
                        onClick={() => setCode(isBooknowApplied ? '' : Object.keys(PromoCodes)[0])}
                    >
                        {!isBooknowApplied ? 'Apply' : 'Remove'}
                    </button>
                </div>
                <div className="promocode-offer-row">
                    <div className="promocode-offer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.7609 9.99999L19.8663 8.08969C19.9991 7.85986 20.0352 7.58667 19.9667 7.33021C19.8982 7.07374 19.7306 6.85499 19.5008 6.72205L17.5885 5.61672V3.41407C17.5885 3.14854 17.483 2.89388 17.2953 2.70612C17.1075 2.51835 16.8529 2.41287 16.5873 2.41287H14.3857L13.2813 0.501575C13.148 0.272216 12.9296 0.104604 12.6736 0.0350146C12.5466 0.000589099 12.4141 -0.00828766 12.2836 0.00889877C12.1532 0.0260852 12.0274 0.0689931 11.9137 0.135135L10.0014 1.24046L8.08911 0.134134C7.85915 0.00137182 7.58588 -0.034606 7.3294 0.0341144C7.07292 0.102835 6.85424 0.270625 6.72146 0.500574L5.61614 2.41287H3.41449C3.14896 2.41287 2.8943 2.51835 2.70654 2.70612C2.51877 2.89388 2.41329 3.14854 2.41329 3.41407V5.61572L0.500992 6.72105C0.386887 6.78668 0.286876 6.87421 0.206703 6.97862C0.126531 7.08302 0.0677781 7.20224 0.0338202 7.32942C-0.000137754 7.4566 -0.00863139 7.58923 0.00882726 7.71971C0.0262859 7.85018 0.0693526 7.97591 0.135553 8.08969L1.24088 9.99999L0.135553 11.9103C0.00338332 12.1403 -0.0324765 12.4133 0.0357919 12.6697C0.10406 12.9261 0.27092 13.1451 0.499991 13.2789L2.41229 14.3843V16.5859C2.41229 16.8514 2.51777 17.1061 2.70553 17.2939C2.8933 17.4816 3.14796 17.5871 3.41349 17.5871H5.61614L6.72146 19.4994C6.8101 19.6509 6.93666 19.7768 7.08868 19.8645C7.24071 19.9523 7.41296 19.999 7.58851 20C7.76272 20 7.93592 19.9539 8.09011 19.8648L10.0004 18.7595L11.9127 19.8648C12.1426 19.9974 12.4157 20.0334 12.6721 19.9649C12.9285 19.8964 13.1472 19.729 13.2803 19.4994L14.3847 17.5871H16.5863C16.8519 17.5871 17.1065 17.4816 17.2943 17.2939C17.482 17.1061 17.5875 16.8514 17.5875 16.5859V14.3843L19.4998 13.2789C19.6137 13.2131 19.7135 13.1255 19.7936 13.021C19.8736 12.9166 19.9322 12.7974 19.9662 12.6703C20.0001 12.5432 20.0087 12.4107 19.9914 12.2803C19.974 12.1499 19.9312 12.0241 19.8653 11.9103L18.7609 9.99999ZM7.4974 4.98396C7.89583 4.98409 8.2779 5.1425 8.55954 5.42433C8.84118 5.70616 8.99933 6.08833 8.9992 6.48677C8.99907 6.8852 8.84066 7.26727 8.55883 7.54891C8.277 7.83055 7.89483 7.9887 7.4964 7.98857C7.09796 7.98844 6.7159 7.83003 6.43425 7.5482C6.15261 7.26637 5.99446 6.8842 5.99459 6.48576C5.99472 6.08733 6.15313 5.70526 6.43496 5.42362C6.71679 5.14198 7.09896 4.98383 7.4974 4.98396ZM7.79776 14.5955L6.19583 13.3951L12.203 5.38544L13.805 6.58589L7.79776 14.5955ZM12.5034 14.996C12.3061 14.9959 12.1108 14.957 11.9285 14.8814C11.7463 14.8059 11.5807 14.6952 11.4413 14.5556C11.3018 14.4161 11.1912 14.2504 11.1158 14.0681C11.0403 13.8858 11.0015 13.6905 11.0016 13.4932C11.0017 13.2959 11.0406 13.1006 11.1162 12.9183C11.1917 12.7361 11.3024 12.5705 11.442 12.431C11.5815 12.2916 11.7472 12.181 11.9295 12.1055C12.1118 12.0301 12.3071 11.9913 12.5044 11.9914C12.9028 11.9915 13.2849 12.1499 13.5666 12.4317C13.8482 12.7136 14.0063 13.0957 14.0062 13.4942C14.0061 13.8926 13.8477 14.2747 13.5658 14.5563C13.284 14.838 12.9018 14.9961 12.5034 14.996Z" fill="#5E4AE3"/>
                        </svg>
                        <span>20% off | Use code FIRSTTIME</span>
                    </div>
                    <button 
                        className={`promocode-apply-btn ${!isFirsttimeApplied ? '' : 'promocode-remove-btn'}`} 
                        onClick={() => setCode(isFirsttimeApplied ? '' : Object.keys(PromoCodes)[1])}
                    >
                        {!isFirsttimeApplied ? 'Apply' : 'Remove'}
                    </button>
                </div>
            </div>

            <div className="promocode-input-and-extra-baggage-box">
                <div className="promocode-input-box card">
                    <h5>Apply Code</h5>
                    <input 
                        type="text" 
                        placeholder="Enter Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
            
                <div className="extra-baggage-box card">
                    <h5>Extra Baggage</h5>
                    {!tickets?.extraBaggage ? <button className="baggage-btn" onClick={addBaggage}>Add to ticket</button> : <button className="remove-baggage-btn" onClick={removeBaggage}>Remove</button>}
                </div>
            </div>

            <div className="bill-details-box card">
                <h5>Bill details</h5>
                <div className="bill-details-info">
                    <div className="bill-details-info-row">
                        <div>Base Ticket Fare: </div>
                        <div>₹{price.tickets.toFixed(2)}</div>
                    </div>
                    {currentFoodList.length > 0 ? (
                            currentFoodList.map((food, index) => (
                                <div className="bill-details-info-row" key={index}>
                                    <div>{food.name} {food.counter > 1 ? ` x ${food.counter}` : ''}:</div>
                                    <div> ₹{(food.price * food.counter).toFixed(2)}</div>
                                </div>
                                ))
                                ) : (
                                <div className="bill-details-info-row">
                                    <div>Food:</div>
                                    <div>₹0.00</div>
                                </div>
                        )}
                    
                    <div className="bill-details-info-row">
                        <div>Extra Baggage:</div>
                        <div>₹{price.baggage.toFixed(2)}</div>
                    </div>
                    <div className="bill-details-info-row">
                        <div>CGST & SGST:</div>
                        <div>₹{price.tax.toFixed(2)}</div>
                    </div>
                    <div className="bill-details-info-row">
                        <div>Discount:</div>
                        <div>{price.discount && price.discount > 0 ? `-₹${price.discount.toFixed(2)}` : '₹0.00'}</div>
                    </div>
                    <div className="bill-details-info-row total-charge">
                        <div>Total Charge:</div> 
                        <div>₹{(price.total ?? 0).toFixed(2)}</div>
                    </div>
                </div>
            </div>

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