import { useEffect, useRef } from "react"
import { useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"
import { Trains } from "../../constants"
import Train from "../../components/SearchResultsPage/Train"
import BookingTicketsForm from "../../components/BookingTicketsForm/BookingTicketsForm"
import './style.css'


function SearchResultsPage(){
    const navigate = useNavigate()
    const {tickets} = useAppSelector(store => store.tickets)


    useEffect(() => {
        console.log(tickets);

        if(!tickets) navigate('/')

    }, [tickets, navigate])

    const planningSectionRef = useRef<HTMLDivElement>(null);

    // 2. Функция, которая будет выполнять плавный скролл
    const handleScrollToPlanning = () => {
        if (planningSectionRef.current) {
            planningSectionRef.current.scrollIntoView({
                behavior: "smooth", // Плавный скролл
                block: "start"      // Выравнивание по верхнему краю экрана
            });
        }
    };

    return (
        <div className="search-results">
            <h2>Search Results</h2>
            <BookingTicketsForm isHome={false}/>
            <div className="pictures-block">
                <div className="picture planning-your-holidays white-text" onClick={handleScrollToPlanning}>
                    Planning your holidays
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H3.17181L8.23789 5L3.17181 10H0L5.08811 5L0 0Z" fill="white"/>
                    </svg>
                </div>
                <div className="picture train-tourism-packages white-text">
                    Train tourism packages
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H3.17181L8.23789 5L3.17181 10H0L5.08811 5L0 0Z" fill="white"/>
                    </svg>
                </div>
                <p className="pictures-block-text">Our trains don't just transport people, they transport emotions and stories! From the mountains of Darjeeling to the beaches of Goa, we connect more than just stations. As Raj Koothrappali would say, "In India, we don't just ride trains, we experience cosmic journeys with occasional cow delays." Book now and embrace the colorful chaos!</p>
            </div>
            <h2 className="trains-title"> Available Trains</h2>
            <div className="trains">
                {Trains.map(train => <Train key={train.id} train={train}/>)}
            </div>
        </div>
    )
}

export default SearchResultsPage