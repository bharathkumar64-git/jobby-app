import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(
        'https://apis.ccbp.in/login',
        options,
      )

      const data = await response.json()

      if (response.ok === true) {
        Cookies.set('jwt_token', data.jwt_token, {
          expires: 30,
        })

        this.props.history.replace('/')
      } else {
        this.setState({
          showSubmitError: true,
          errorMsg: data.error_msg,
        })
      }
    } catch (error) {
      this.setState({
        showSubmitError: true,
        errorMsg: 'Something went wrong',
      })
    }
  }

  render() {
    const {
      username,
      password,
      showSubmitError,
      errorMsg,
    } = this.state

    return (
      <div className="login-page">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />

          <form onSubmit={this.submitForm}>
            <label htmlFor="username">USERNAME</label>

            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={this.onChangeUsername}
            />

            <label htmlFor="password">PASSWORD</label>

            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={this.onChangePassword}
            />

            <button type="submit">Login</button>

            {showSubmitError && <p>{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login