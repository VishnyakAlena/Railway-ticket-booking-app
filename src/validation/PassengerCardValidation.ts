import * as Yup from 'yup';

const currentYear = new Date().getFullYear();

// Схема для валидации одного пассажира
export const passengerValidationSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Имя слишком короткое')
        .matches(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, 'Имя может содержать только буквы, пробелы и дефис')
        .required('Обязательное поле'),
    
    phoneNumber: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Неверный формат телефона (например, +79991234567)')
        .required('Обязательное поле'),
        
    email: Yup.string()
        .email('Неверный формат email')
        .required('Обязательное поле'),
    
    birthDate: Yup.string()
        .matches(
            /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
            'Формат даты должен быть ДД.ММ.ГГГГ'
        )
        .required('Обязательное поле')
        .test('year-check', `Год не может быть больше ${currentYear}`, (value: string | undefined) => {
            if (!value) return false;
            
            // Разрезаем строку "12.12.1975" по точкам и забираем последний элемент (год)
            const parts = value.split('.');
            const year = parseInt(parts[2], 10);
            
            // Проверяем, чтобы год не был из будущего
            return year <= currentYear;
            }),
});

// Схема для корневой формы Formik, которая содержит массив пассажиров
export const bookingValidationSchema = Yup.object().shape({
    passengers: Yup.array().of(passengerValidationSchema),
});