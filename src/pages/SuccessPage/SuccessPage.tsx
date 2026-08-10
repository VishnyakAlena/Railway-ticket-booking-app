import './style.css'
import successImg from '../../assets/images/success.png'
import BoardingDetails from '../../components/BoardingDetails/BoardingDetails';
import TravellerDetails from '../../components/TravellerDetails/TravellerDetails';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/storeHooks';
import { clearCurrentBooking } from "../../store/slices/ticketSlice"; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function SuccessPage(){
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    function handleBookAnother() {
        dispatch(clearCurrentBooking());
        navigate('/'); 
    }

    const handleDownloadTicket = async () => {
    const qrElement = document.getElementById("qr-code-ticket-to-print");
    const dataElement = document.getElementById("ticket-to-print");
    
    if (!qrElement || !dataElement) return;

    try {
        // 1. Делаем скриншоты обоих блоков в высоком разрешении
        const [qrCanvas, dataCanvas] = await Promise.all([
            html2canvas(qrElement, { scale: 2, backgroundColor: "#ffffff" }),
            html2canvas(dataElement, { scale: 2, backgroundColor: "#ffffff" })
        ]);

        const qrImg = qrCanvas.toDataURL("image/png");
        const dataImg = dataCanvas.toDataURL("image/png");

        // 2. Создаем PDF-документ формата A4 (210мм x 297мм)
        const pdf = new jsPDF("p", "mm", "a4");
        
        const pageWidth = 210;
        const margin = 15; // Отступы от краев страницы в мм
        const contentWidth = pageWidth - (margin * 2); // Рабочая ширина 180мм

        // 3. Высчитываем пропорциональную высоту для QR-блока
        // Ограничим его ширину, например, до 60мм, чтобы он не был гигантским
        const qrWidthInPdf = 60; 
        const qrHeightInPdf = (qrCanvas.height * qrWidthInPdf) / qrCanvas.width;
        
        // Центрируем QR-код по горизонтали
        const qrX = (pageWidth - qrWidthInPdf) / 2; 
        const qrY = 15; // Отступ сверху

        // Добавляем QR-код в PDF
        pdf.addImage(qrImg, "PNG", qrX, qrY, qrWidthInPdf, qrHeightInPdf);

        // 4. Высчитываем координаты для карточки с данными
        const dataWidthInPdf = contentWidth; // Карточка займет всю ширину (180мм)
        const dataHeightInPdf = (dataCanvas.height * dataWidthInPdf) / dataCanvas.width;
        
        // Располагаем карточку под QR-кодом с отступом в 10мм
        const dataX = margin;
        const dataY = qrY + qrHeightInPdf + 10; 

        // Добавляем карточку с данными в PDF
        pdf.addImage(dataImg, "PNG", dataX, dataY, dataWidthInPdf, dataHeightInPdf);

        // 5. Скачиваем готовый файл
        pdf.save(`ticket-${PNRNumber}.pdf`);

    } catch (error) {
        console.error("Ошибка генерации PDF из двух блоков:", error);
    }
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
            <div className='success-card card' id="ticket-to-print">
                <div className='transactions-numbers'>
                    <div>PNR No: {PNRNumber}</div>
                    <div>Transaction ID:  {TransactionID}</div>
                </div>
                <BoardingDetails className="hidden"/>
                <TravellerDetails showExtraBlock={true}  showAge={false} className='success-page-card'/>
            </div>
            <div className='qr-code-block card'>
                <div className='qr-code-wrapper' id="qr-code-ticket-to-print">
                    <QRCodeSVG
                        value={qrData}             // Данные, зашитые в код
                        size={220}                 // Размер QR-кода в пикселях (ширина и высота)
                        bgColor={"#ffffff"}        // Цвет заднего фона
                        fgColor={"#000000"}        // Цвет самого QR-кода
                        level={"L"}                // Уровень коррекции ошибок (L, M, Q, H)
                        marginSize={0}           // Без полей вокруг 
                    />
                </div>
                <div className="success-buttons-block buttons-block">
                    <button className='main-button' onClick={handleBookAnother}>Book another ticket</button>
                    <button className='main-button' onClick={handleDownloadTicket}>Download Ticket</button>
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