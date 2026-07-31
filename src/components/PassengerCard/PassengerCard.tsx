import type { PassengerDetailsType } from "../../types";
import './style.css'

interface PassengerCardProps {
    index: number;
    passenger: PassengerDetailsType;
    onInputChange: (field: keyof PassengerDetailsType, value: string) => void;
}

function PassengerCard({ index, passenger, onInputChange }: PassengerCardProps) {
    return (
        <div className="passenger-card-form card">
            <h3>Passenger {index + 1}</h3>
            <p className="passenger-card-form-description">Please enter your contact info</p>
            
            <div className="passenger-inputs-grid">
                <div className="passenger-inputs-grid-row">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={passenger.fullName}
                            onChange={(e) => onInputChange('fullName', e.target.value)}
                            placeholder="You name"
                        />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input 
                            type="tel" 
                            required
                            value={passenger.phoneNumber}
                            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                            placeholder="+91"
                        />
                    </div>
                </div>
                <div className="passenger-inputs-grid-row">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={passenger.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            placeholder="john.doe@company.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Birth Date</label>
                        <input 
                            type="text" 
                            required
                            value={passenger.birthDate}
                            onChange={(e) => onInputChange('birthDate', e.target.value)}
                            placeholder="12.12.1975"
                        />
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default PassengerCard;