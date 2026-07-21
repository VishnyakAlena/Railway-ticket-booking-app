import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import HomePage from './pages/HomePage/HomePage'
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage'
import ReviewBookingPage from './pages/ReviewBookingPage/ReviewBookingPage'

function App() {

  return (
    <>
      <main>
        <Header/>
        <Routes>
          <Route path='/' element={ <HomePage/> } />
          <Route path='/search-results' element={ <SearchResultsPage/> } />
          <Route path='/review-booking' element={ <ReviewBookingPage/> } />
        </Routes>
      </main>
    </>
  )
}

export default App
