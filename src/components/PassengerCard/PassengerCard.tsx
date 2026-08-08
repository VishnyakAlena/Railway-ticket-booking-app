import type { FormikProps } from "formik";
import type { PassengerDetailsType } from "../../types";
import './style.css'

interface PassengerCardProps {
    index: number;
    formik: FormikProps<{ passengers: PassengerDetailsType[] }>;
}

function PassengerCard({ index, formik }: PassengerCardProps) {
    const getFieldProps = (fieldName: keyof PassengerDetailsType) => {
        const name = `passengers[${index}].${fieldName}`;
        // getFieldMeta автоматически вернет правильные типы для конкретного поля
        const meta = formik.getFieldMeta(name); 
        
        return {
            name,
            value: formik.values.passengers[index]?.[fieldName] || '',
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
            className: meta.touched && meta.error ? 'input-error' : ''
        };
    };

    const getFieldError = (fieldName: keyof PassengerDetailsType) => {
        const name = `passengers[${index}].${fieldName}`;
        const meta = formik.getFieldMeta(name);

        return meta.touched && meta.error ? (
            <span className="error-message">{meta.error}</span>
        ) : null;
    };

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
                            placeholder="You name"
                            {...getFieldProps('fullName')}
                        />
                        {getFieldError('fullName')}
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input 
                            type="tel" 
                            placeholder="+91"
                            {...getFieldProps('phoneNumber')}
                        />
                        {getFieldError('phoneNumber')}
                    </div>
                </div>
                <div className="passenger-inputs-grid-row">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="john.doe@company.com"
                            {...getFieldProps('email')}
                        />
                        {getFieldError('email')}
                    </div>
                    <div className="input-group">
                        <label>Birth Date</label>
                        <input 
                            type="text" 
                            placeholder="12.12.1975"
                            {...getFieldProps('birthDate')}
                        />
                        {getFieldError('birthDate')}
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default PassengerCard;