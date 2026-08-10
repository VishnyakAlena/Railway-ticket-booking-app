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
import MissingPage from './pages/MissingPage/MissingPage'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

function App() {
  const location = useLocation();
  const validPaths = ['/', '/search-results', '/review-booking', '/payment', '/success'];
  const isHomePage = location.pathname === '/'; 
  const isMissingPage = !validPaths.includes(location.pathname); 

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('home-page-active');
    } else {
      document.body.classList.remove('home-page-active');
    }

    return () => {
      document.body.classList.remove('home-page-active');
    }
}, [isHomePage]); 

  return (
    <>
      <ScrollToTop />
      <Header isHome={isHomePage}/>
      <main className='app-container'>
        <Routes>
          <Route path='/' element={ <HomePage/> } />
          <Route path='/search-results' element={ <SearchResultsPage/> } />
          <Route path='/review-booking' element={ <ReviewBookingPage/> } />
          <Route path='/payment' element={ <PaymentPage /> } />
          <Route path='/success' element={ <SuccessPage /> } />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </main>
      {!isHomePage && !isMissingPage && <Footer />}
    </>
  )
}

export default App
