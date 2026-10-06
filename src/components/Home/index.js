import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  return (
    <>
      <Header />

      <div className="home-page">
        <div className="home-content">
          <h1>Find The Job That Fits Your Life</h1>

          <p>
            Millions of people are searching for jobs, salary information,
            company reviews, and more.
          </p>

          <Link to="/jobs">
            <button type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home