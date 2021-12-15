import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../components/logs/responseTable";
import RequestTable from "../components/logs/requestTable";
import { setUser, getUser, isLoggedIn } from "../services/auth";
import { navigate } from "gatsby-link";

const IndexPage = () => {
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    }
  }, [context]);

  const login = (event) => {
    event.preventDefault();

    let usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    let passwordInput = document.getElementById('passwordInput') as HTMLInputElement;

    let body = {
      username: usernameInput.value ? usernameInput.value : null,
      password: passwordInput.value ? passwordInput.value : null,
    }

    fetch(`${context.apiUrl}/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('User:', data);
        if (typeof window !== "undefined") {

          let result = {
            username: data.username,
          }
          setUser(result);
          sessionStorage.setItem('jwt', data.jwtToken)
          sessionStorage.setItem('user', JSON.stringify(result));
          navigate("/");
        }
      })
  }


  return (
    <Layout
      title={"Dashboard"}
      subtext={isLoggedIn() ? `Welcome ${getUser().username}, to the gateway admin dashboard` : `Welcome to the gateway admin dashboard`}
    >
      {
        isLoggedIn() && context !== null ? (
          <a href={`${context.adminUrl}/export/all`} target="_blank">
            <button className="utrecht-button" type="button">
              Export Configuration
            </button>
          </a>
      ) : (
      <form id="dataForm" onSubmit={login}>
        <div className="row">
          <div className="col-4">
            <div className="form-group">
              <span className="utrecht-form-label mb-2">Username</span>
              <input className="utrecht-textbox utrecht-textbox--html-input" name="username"
                id="usernameInput" required />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="form-group">
              <span className="utrecht-form-label">Password</span>
              <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password"
                id="passwordInput" />
            </div>

            <a className="utrecht-link" onClick={login}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-primary"><i
                className="fas fa-sign-in-alt mr-2"></i>Login
              </button>
            </a>
          </div>
        </div>
      </form>
        )}
    </Layout>
  );
};

export default IndexPage;
