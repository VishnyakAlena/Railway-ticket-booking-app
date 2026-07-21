import { useState } from "react"
import { indianRailwayStations } from "../../../constants/cities"
import type { CityType } from "../../../types"
import './style.css'

type props = {
    title: string
    isActive: boolean
    city:CityType
    setCity: React.Dispatch<React.SetStateAction<CityType>>
    isHome: boolean
}

function CityInput({
    title, 
    isActive,
    city,
    setCity,
    isHome
}:props) {
    
    const [findCities, setFindCities] = useState<CityType[]>([])
    
    function onInput(text: string) {
        const finding = indianRailwayStations.filter(city => {
            const name = city.name.toLocaleLowerCase()
            const lowText = text.toLocaleLowerCase()

            if(name.startsWith(lowText) && text) {
                return city
            }
        })

        setCity({name:text, code:''})
        setFindCities(finding)
    }

    function onClickCity(city:CityType){
        setFindCities([])
        setCity(city)
    }

    return (
        <div>
            <label className={`form-label ${isHome ? 'white-text' : 'black-text'}`} htmlFor={title}>{title}</label>
            <input 
                type="text"  
                id={title} 
                value={city.name}
                disabled={!isActive}
                onChange={(e) => onInput(e.target.value)} 
            />
            <ul>
                {
                    findCities.map(city => 
                    <li 
                        key={city.code} 
                        onClick={() => onClickCity(city)}>
                            {city.name}
                    </li>)
                }
            </ul>
        </div>
    )
}

export default CityInput