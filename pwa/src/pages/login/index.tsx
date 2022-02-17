import * as React from "react";
import "./login.css";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { setUser } from "./../../services/auth";
import { navigate } from "gatsby-link";
import Footer from "../../components/footer/footer";


const Login: React.FC = () => {
  const [username, setUsername] = React.useState<string>(null)
  const [password, setPassword] = React.useState<string>(null)
  const [error, setError] = React.useState<string>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const API: APIService = React.useContext(APIContext)

  const handleLogin = (): void => {
    setLoading(true)

    const body = {...{username, password}}

    API.Login.login(body)
      .then((res) => {
        const user = { username: res.data.username }

        setUser(user)
        sessionStorage.setItem("jwt", res.data.jwtToken);
        sessionStorage.setItem("user", JSON.stringify(user));

        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        // setError(err.response.data.message)
      })
      .finally(() => { setLoading(false) })
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>Welcome to your gateway admin dashboard</h1>


        <form className="login-form">
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required />

          {error && <span className="login-form-error">{error}</span>}

          <button onClick={handleLogin} disabled={loading || (!username || !password)}>
            {!loading ? "Login" : "Loading..."}
          </button>
        </form>
      </div>

      <Footer layoutClassName="login-footer" />
    </div>
  )
}

export default Login
