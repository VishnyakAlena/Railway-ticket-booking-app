import { useEffect, useRef } from "react"
import { useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import Train from "../../components/SearchResultsPage/Train/Train"
import BookingTicketsForm from "../../components/BookingTicketsForm/BookingTicketsForm"
import './style.css'


function SearchResultsPage(){
    const navigate = useNavigate()
    const {tickets, trains} = useAppSelector(store => store.tickets)


    useEffect(() => {
        if(!tickets) navigate('/')

    }, [tickets, navigate])

    const planningSectionRef = useRef<HTMLDivElement>(null);
    const trainsSectionRef = useRef<HTMLDivElement>(null);

    // 2. Функция, которая будет выполнять плавный скролл
    const handleScrollToPlanning = () => {
        if (planningSectionRef.current) {
            planningSectionRef.current.scrollIntoView({
                behavior: "smooth", // Плавный скролл
                block: "start"      // Выравнивание по верхнему краю экрана
            });
        }
    };
    const handleScrollToTrains = () => {
        if (trainsSectionRef.current) {
            trainsSectionRef.current.scrollIntoView({
                behavior: "smooth", // Плавный скролл
                block: "start"      // Выравнивание по верхнему краю экрана
            });
        }
    };

    // === НАЧАЛО ИЗМЕНЕНИЙ: СБОРКА И ПАРСИНГ ДАТ ИЗ REDUX ===
    const parseLocaleDate = (dateStr: string | undefined): Date => {
        if (!dateStr) return new Date();
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
    };

    // Получаем реальные JS-объекты дат отправления и прибытия (+1 день)
    const departureDateObject = parseLocaleDate(tickets?.departureDay);
    const arrivalDateObject = new Date(departureDateObject);
    arrivalDateObject.setDate(arrivalDateObject.getDate() + 1);

    // Переводим в формат макета Figma (например, "Nov 16")
    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formattedDeparture = new Intl.DateTimeFormat('en-US', formatOptions).format(departureDateObject);
    const formattedArrival = new Intl.DateTimeFormat('en-US', formatOptions).format(arrivalDateObject);
    // === КОНЕЦ ИЗМЕНЕНИЙ ===

    return (
        <div ref={planningSectionRef} className="search-results">
            <h2>Search Results</h2>
            <BookingTicketsForm isHome={false}/>
            <div className="pictures-block">
                <div className="picture planning-your-holidays white-text" onClick={handleScrollToPlanning}>
                    Planning your holidays
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H3.17181L8.23789 5L3.17181 10H0L5.08811 5L0 0Z" fill="white"/>
                    </svg>
                </div>
                <div className="picture train-tourism-packages white-text" onClick={handleScrollToTrains}>
                    Train tourism packages
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H3.17181L8.23789 5L3.17181 10H0L5.08811 5L0 0Z" fill="white"/>
                    </svg>
                </div>
                <p className="pictures-block-text">Our trains don't just transport people, they transport emotions and stories! From the mountains of Darjeeling to the beaches of Goa, we connect more than just stations. As Raj Koothrappali would say, "In India, we don't just ride trains, we experience cosmic journeys with occasional cow delays." Book now and embrace the colorful chaos!</p>
            </div>
            <h2 className="trains-title" ref={trainsSectionRef}> Available Trains</h2>
            <div className="trains">
                {/* ИЗМЕНЕНИЕ: Модифицируем объекты поездов «на лету» перед рендером */}
                {trains.map(train => {
                    const dynamicTrain = {
                        ...train,
                        info: {
                            ...train.info,
                            departure: {
                                ...train.info.departure,
                                day: formattedDeparture // Перезаписываем 'Nov 16' на выбранный день
                            },
                            arrival: {
                                ...train.info.arrival,
                                day: formattedArrival // Перезаписываем 'Nov 17' на следующий день
                            }
                        }
                    };
                    return <Train key={train.id} train={dynamicTrain}/>
})}
            </div>
        </div>
    )
}

export default SearchResultsPage