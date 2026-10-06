import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    searchInput: '',
    activeEmploymentTypes: [],
    activeSalaryRange: '1000000',
    isLoading: true,
    apiStatus: 'INITIAL',
    profileApiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: 'LOADING'})

    try {
      const response = await fetch('https://apis.ccbp.in/profile')
      const data = await response.json()

      if (response.ok === true) {
        this.setState({
          profileDetails: data.profile_details,
          profileApiStatus: 'SUCCESS',
        })
      } else {
        this.setState({profileApiStatus: 'FAILURE'})
      }
    } catch (error) {
      this.setState({profileApiStatus: 'FAILURE'})
    }
  }

  getJobs = async () => {
    this.setState({
      isLoading: true,
      apiStatus: 'LOADING',
    })

    const {
      searchInput,
      activeEmploymentTypes,
      activeSalaryRange,
    } = this.state

    const employmentTypeIds = activeEmploymentTypes.join(',')

    const jobsApiUrl =
      `https://apis.ccbp.in/jobs?employment_type=${employmentTypeIds}` +
      `&minimum_package=${activeSalaryRange}` +
      `&search=${searchInput}`

    try {
      const response = await fetch(jobsApiUrl)
      const data = await response.json()

      if (response.ok === true) {
        this.setState({
          jobsList: data.jobs,
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

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {value, checked} = event.target

    this.setState(
      previousState => {
        if (checked) {
          return {
            activeEmploymentTypes: [
              ...previousState.activeEmploymentTypes,
              value,
            ],
          }
        }

        return {
          activeEmploymentTypes:
            previousState.activeEmploymentTypes.filter(
              item => item !== value,
            ),
        }
      },
      this.getJobs,
    )
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        activeSalaryRange: event.target.value,
      },
      this.getJobs,
    )
  }

  renderProfile = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-card">
        <img
          src={profileDetails.profile_image_url}
          alt="profile"
          className="profile-image"
        />

        <h1>{profileDetails.name}</h1>

        <p>{profileDetails.short_bio}</p>
      </div>
    )
  }

  renderFilters = () => {
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <>
        <hr />

        <h2>Type of Employment</h2>

        <ul>
          {employmentTypesList.map(eachItem => (
            <li key={eachItem.employmentTypeId}>
              <input
                type="checkbox"
                id={eachItem.employmentTypeId}
                value={eachItem.employmentTypeId}
                onChange={this.onChangeEmploymentType}
              />

              <label htmlFor={eachItem.employmentTypeId}>
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>

        <hr />

        <h2>Salary Range</h2>

        <ul>
          {salaryRangesList.map(eachItem => (
            <li key={eachItem.salaryRangeId}>
              <input
                type="radio"
                id={eachItem.salaryRangeId}
                name="salary"
                value={eachItem.salaryRangeId}
                onChange={this.onChangeSalaryRange}
              />

              <label htmlFor={eachItem.salaryRangeId}>
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobItem = job => {
    const {
      id,
      company_logo_url: companyLogoUrl,
      title,
      rating,
      location,
      employment_type: employmentType,
      package_per_annum: packagePerAnnum,
      job_description: jobDescription,
    } = job

    return (
      <li key={id} className="job-card">
        <Link to={`/jobs/${id}`} className="job-link">
          <div className="job-title">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />

            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
          </div>

          <div className="job-info">
            <p>{location}</p>
            <p>{employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>

          <hr />

          <h2>Description</h2>

          <p>{jobDescription}</p>
        </Link>
      </li>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />

          <h1>No Jobs Found</h1>

          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(this.renderJobItem)}
      </ul>
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

      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container">
      <div data-testid="loader">Loading...</div>
    </div>
  )

  renderProfileFailure = () => (
    <div>
      <button type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  render() {
    const {
      searchInput,
      isLoading,
      apiStatus,
      profileApiStatus,
    } = this.state

    return (
      <>
        <Header />

        <div className="jobs-page">
          <aside className="sidebar">
            {profileApiStatus === 'FAILURE'
              ? this.renderProfileFailure()
              : this.renderProfile()}

            {this.renderFilters()}
          </aside>

          <main className="jobs-content">
            <div className="search-box">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                placeholder="Search"
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                Search
              </button>
            </div>

            {isLoading && this.renderLoader()}

            {!isLoading &&
              apiStatus === 'SUCCESS' &&
              this.renderJobsList()}

            {!isLoading &&
              apiStatus === 'FAILURE' &&
              this.renderFailureView()}
          </main>
        </div>
      </>
    )
  }
}

export default Jobs