import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage'
import ReviewBookingPage from './pages/ReviewBookingPage/ReviewBookingPage'
import { useEffect } from 'react'
import Footer from './components/Footer/Footer'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import SuccessPage from './pages/SuccessPage/SuccessPage'

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // true, если мы на главной
  // Следим за изменением страницы
  useEffect(() => {
    if (location.pathname === '/') {
      // Если мы на главной, добавляем класс к body
      document.body.classList.add('home-page-active');
    } else {
      // Если ушли на другую страницу, убираем этот класс
      document.body.classList.remove('home-page-active');
    }

     // Чистим класс при размонтировании компонента (хорошая практика)
    return () => document.body.classList.remove('home-page-active');
  }, [location.pathname]); // Эффект срабатывает каждый раз, когда меняется URL

  return (
    <>
      <main className='app-container'>
        <Header isHome={isHomePage}/>
        <Routes>
          <Route path='/' element={ <HomePage/> } />
          <Route path='/search-results' element={ <SearchResultsPage/> } />
          <Route path='/review-booking' element={ <ReviewBookingPage/> } />
          <Route path='/payment' element={ <PaymentPage /> } />
          <Route path='/success' element={ <SuccessPage /> } />
        </Routes>
        {!isHomePage && <Footer />} 
      </main>
    </>
  )
}

export default App
