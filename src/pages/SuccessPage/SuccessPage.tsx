import './style.css'
import successImg from '../../assets/images/success.png'
import BoardingDetails from '../../components/BoardingDetails/BoardingDetails';
import TravellerDetails from '../../components/TravellerDetails/TravellerDetails';

function SuccessPage(){
    const generateNumericPNR = (): string => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const generateTransactionID = (): string => {
    // 100 000 000 000 000 (10 в 14-й степени) — минимальное 15-значное число
    // 900 000 000 000 000 — диапазон множителя
    return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
};

    return (
        <div className='success-page'>
            <div className='success-title'>
                <img src={successImg} alt="successImg" />
                <h2>
                    Congratulations! <br />
                    You have successfully booked tickets
                </h2>
            </div>
            <div className='success-card card'>
                <div className='transactions-numbers'>
                    <div>PNR No: {generateNumericPNR()}</div>
                    <div>Transaction ID:  {generateTransactionID()}</div>
                </div>
                <BoardingDetails className="hidden"/>
                <TravellerDetails showExtraBlock={true}  showAge={false} className='success-page-card'/>
            </div>
            <div className='qr-code-block card'>
                <div className='qr-code'></div>
                <div className="success-buttons-block buttons-block">
                    <button className='main-button'>Book another ticket</button>
                    <button className='main-button'>Download Ticket</button>
                </div>
            </div>
            <div className="buttons-info buttons-info-links">
                <div>Cancellation Policy</div>
                <div>Terms & Conditions</div>
                <div>Travel Insurance</div>
            </div>
        </div>
    )
}

export default SuccessPage