import { useAppSelector } from '../../store/storeHooks';
import './style.css'

interface TravellerDetailsProps {
        className?: string;
        showExtraBlock?: boolean; 
        showAge?: boolean
    }

function TravellerDetails({className="", showExtraBlock = false, showAge = true }: TravellerDetailsProps) {

    const { passengersData, tickets } = useAppSelector(store => store.tickets);
    const firstPassenger = passengersData[0];
    const currentFoodList = tickets?.food || [];

    const getAge = (birthDateString: string): number => {
        if (!birthDateString) return 0;

        // Разрезаем строку "ДД.ММ.ГГГГ" по точкам
        const [day, month, year] = birthDateString.split('.').map(Number);
        
        // Создаем объект даты рождения (в JS месяцы идут от 0 до 11, поэтому month - 1)
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        // Считаем грубую разницу в годах
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Проверяем, был ли уже день рождения в текущем году
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Если текущий месяц меньше месяца рождения, 
        // или месяцы одинаковые, но текущий день меньше дня рождения — вычитаем 1 год
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    };
    

    return (
        <div className="traveller-details">
            <h3>Traveller Details</h3>
            {firstPassenger ? (
                    <div className={`traveller-details-info ${className}`}>
                        <div className="traveller-details-info-row">
                            <div>{firstPassenger.fullName}</div>
                            {showAge && (
                                <div>{getAge(firstPassenger.birthDate)} Yrs</div>
                            )}
                        </div>

                        {showExtraBlock && (
                            <div className="extra-success-block">
                                <div>Booking Status :  Confirmed (CNF)</div>
                                <div>Seat/Coach no. :  Class {tickets?.train?.railcar?.name} & {tickets?.train?.railcar?.tarife} Quota</div>
                            </div>
                        )}

                        <div className={`bill-details-info-row ${className}`}>{className?.includes('success-page-card') ? 
                            (<div>Extra Baggage: {(tickets?.extraBaggage === true) ? '1' : '0'}</div>) :
                            (<>
                                <div>Extra Baggage</div>
                                <div>{(tickets?.extraBaggage === true) ? '1' : '0'}</div>
                            </>)}
                        </div>
                        {currentFoodList.length > 0 ? (
                            currentFoodList.map((food, index) => (
                                <div className={`bill-details-info-row ${className}`} key={index}>{className?.includes('success-page-card') ? 
                                    (<div>{food.name}: {food.counter}</div>) :
                                    (<>
                                        <div>{food.name}</div>
                                        <div>{food.counter}</div>
                                    </>)}
                                </div>
                                ))
                                ) : (
                                <div className={`bill-details-info-row ${className}`}>{className?.includes('success-page-card') ? 
                                    (<div>Food: 0</div>) :
                                    (<>
                                        <div>Food</div>
                                        <div>0</div>
                                    </>)}
                                </div>
                        )}
                        <div className="traveller-details-info-row traveller-email">
                            <div>{className?.includes('success-page-card') 
                                ? 'E-Tickets has been sent to:' 
                                : 'E-Tickets will be sent to:'}
                            </div>
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