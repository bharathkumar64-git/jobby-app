import {Link} from 'react-router-dom'
import {BsBriefcase, BsGeoAlt} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    companyLogoUrl,
    rating,
    location,
    packagePerAnnum,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div>
            <h2>{title}</h2>
            <div className="rating">
              <AiFillStar />
              <span>{rating}</span>
            </div>
          </div>
        </div>

        <div className="job-meta">
          <div>
            <BsGeoAlt />
            <span>{location}</span>
          </div>

          <div>
            <BsBriefcase />
            <span>{employmentType}</span>
          </div>

          <p>{packagePerAnnum}</p>
        </div>

        <hr />

        <h3>Description</h3>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem