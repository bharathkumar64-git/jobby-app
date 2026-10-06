import {Component} from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {id} = match.params

    this.setState({
      isLoading: true,
      apiStatus: 'LOADING',
    })

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`

    try {
      const response = await fetch(jobDetailsApiUrl)
      const data = await response.json()

      if (response.ok === true) {
        this.setState({
          jobDetails: data.job_details,
          similarJobs: data.similar_jobs,
          isLoading: false,
          apiStatus: 'SUCCESS',
        })
      } else {
        this.setState({
          isLoading: false,
          apiStatus: 'FAILURE',
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        apiStatus: 'FAILURE',
      })
    }
  }

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state

    const {
      company_logo_url: companyLogoUrl,
      title,
      rating,
      location,
      employment_type: employmentType,
      package_per_annum: packagePerAnnum,
      job_description: jobDescription,
      skills = [],
      life_at_company: lifeAtCompany = {},
    } = jobDetails

    return (
      <>
        <div className="details-card">
          <div className="job-title">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />

            <div>
              <h1>{title}</h1>
              <p>⭐ {rating}</p>
            </div>
          </div>

          <div className="job-info">
            <p>📍 {location}</p>
            <p>💼 {employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description-header">
            <h2>Description</h2>

            <a
              href={jobDetails.company_website_url}
              target="_blank"
              rel="noreferrer"
            >
              Visit
            </a>
          </div>

          <p>{jobDescription}</p>

          <h2>Skills</h2>

          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <img src={eachSkill.image_url} alt={eachSkill.name} />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h2>Life at Company</h2>

          <div className="life-company">
            <p>{lifeAtCompany.description}</p>

            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
            />
          </div>
        </div>

        <h1>Similar Jobs</h1>

        <ul className="similar-list">
          {similarJobs.map(eachJob => (
            <li key={eachJob.id} className="similar-card">
              <Link
                to={`/jobs/${eachJob.id}`}
                className="job-link"
              >
                <div className="job-title">
                  <img
                    src={eachJob.company_logo_url}
                    alt="similar job company logo"
                    className="company-logo"
                  />

                  <div>
                    <h1>{eachJob.title}</h1>
                    <p>⭐ {eachJob.rating}</p>
                  </div>
                </div>

                <div className="job-info">
                  <p>📍 {eachJob.location}</p>
                  <p>💼 {eachJob.employment_type}</p>
                </div>

                <h2>Description</h2>

                <p>{eachJob.job_description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>

      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container">
      <div data-testid="loader">Loading...</div>
    </div>
  )

  render() {
    const {isLoading, apiStatus} = this.state

    return (
      <>
        <Header />

        <div className="details-page">
          <Link to="/jobs">← Back to Jobs</Link>

          {isLoading && this.renderLoader()}

          {!isLoading &&
            apiStatus === 'SUCCESS' &&
            this.renderJobDetails()}

          {!isLoading &&
            apiStatus === 'FAILURE' &&
            this.renderFailureView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails