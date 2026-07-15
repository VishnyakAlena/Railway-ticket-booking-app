import { useEffect } from "react"
import { useAppSelector } from "../../store/storeHooks"
import { useNavigate } from "react-router-dom"

function SearchResultsPage(){
    const navigate = useNavigate()
    const {tickets} = useAppSelector(store => store.tickets)

useEffect(() => {
    console.log(tickets);

    if(!tickets) navigate('/')

}, [])

    return (
        <h1>Search Results</h1>
    )
}

export default SearchResultsPage