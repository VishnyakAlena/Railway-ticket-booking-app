import './style.css'
import successImg from '../../assets/images/success.png'
import BoardingDetails from '../../components/BoardingDetails/BoardingDetails';
import TravellerDetails from '../../components/TravellerDetails/TravellerDetails';
import { QRCodeSVG } from 'qrcode.react';

function SuccessPage(){
    const generateNumericPNR = (): string => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const PNRNumber = generateNumericPNR()

    const generateTransactionID = (): string => {
        return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
    };

    const TransactionID = generateTransactionID()

    const qrData = JSON.stringify({
        pnr: PNRNumber,
        txId: TransactionID,
        status: "CONFIRMED"
    });


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
                    <div>PNR No: {PNRNumber}</div>
                    <div>Transaction ID:  {TransactionID}</div>
                </div>
                <BoardingDetails className="hidden"/>
                <TravellerDetails showExtraBlock={true}  showAge={false} className='success-page-card'/>
            </div>
            <div className='qr-code-block card'>
                    <QRCodeSVG
                        value={qrData}             // Данные, зашитые в код
                        size={220}                 // Размер QR-кода в пикселях (ширина и высота)
                        bgColor={"#ffffff"}        // Цвет заднего фона
                        fgColor={"#000000"}        // Цвет самого QR-кода
                        level={"L"}                // Уровень коррекции ошибок (L, M, Q, H)
                        marginSize={0}           // Без полей вокруг 
                    />
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