import './style.css'
import errorImg from '../../assets/images/Missing-page.png'
import { useNavigate } from 'react-router-dom';

function MissingPage() {
    const navigate = useNavigate();

    return (
        <div className="missing-page center">
            <img src={errorImg} alt="error 404 image" />
            <h2>Boo! Page missing! </h2>
            <p className='missing-page-description'>Whoops! This page must be a ghost - it's not here!</p>
            <button className='main-button missing-page-btn' onClick={() => navigate('/')}>Find shelter</button>
        </div>
    )
}

export default MissingPage