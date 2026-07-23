import { useEffect, useState } from "react"
import { indianRailwayStations } from "../../../constants/cities"
import type { CityType } from "../../../types"
import './style.css'

type props = {
    title: string
    city:CityType
    setCity: React.Dispatch<React.SetStateAction<CityType>>
    isHome: boolean
}

function CityInput({
    title, 
    city,
    setCity,
    isHome
}:props) {
    
    const [inputValue, setInputValue] = useState(city.name || '');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setInputValue(city.name || '');
    }, [city.name]);

    // ДИНАМИЧЕСКАЯ ФИЛЬТРАЦИЯ: вычисляем список городов на лету
    const filteredCities = indianRailwayStations.filter(station => {
        // Если в инпуте ничего не введено — возвращаем TRUE для всех станций (показываем весь список)
        if (!inputValue) return true;
        
        // Если текст вводится — фильтруем станции по совпадению букв
        return station.name.toLowerCase().includes(inputValue.toLowerCase());
    }).slice(0, 15); // Ограничиваем до 15 элементов, чтобы огромный список не тормозил браузер

    // Срабатывает, когда пользователь выбирает город из выпадающего списка
    const handleSelectCity = (selectedCity: CityType) => {
        setCity(selectedCity);       // Сохраняем весь объект города в родительский стейт
        setInputValue(selectedCity.name); // Записываем имя города в инпут
        setIsFocused(false);         // Закрываем выпадающий список
    };

    // Срабатывает, когда пользователь вводит текст с клавиатуры
    const handleInputChange = (text: string) => {
        setInputValue(text);
        // Сбрасываем родительский стейт города, пока пользователь пишет кастомный текст
        setCity({ ...city, name: text }); 
    };

    const handleClear = () => {
        setInputValue('');
    };

    return (
        <div className="city-input">
            <label className={`label ${isHome ? 'white-text' : 'black-text'}`} htmlFor={title}>{title}</label>
            <div className="city-input-wrapper">
                <input
                    type="text"  
                    id={title} 
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)} 
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoComplete="off"
                />
            
                {inputValue && (
                    <button className="clear-button"
                        onClick={handleClear}>
                        &#x2715;
                    </button>
                    )
                }
            </div>
            
            
            {isFocused && filteredCities.length > 0 && (
                <ul className="city-dropdown-list">
                    {filteredCities.map(city => 
                        <li 
                            key={city.code} 
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectCity(city);
                            }}
                        >
                            {city.name}
                        </li>
                        )}
                </ul>
            )}
        </div>
    )
}

export default CityInput