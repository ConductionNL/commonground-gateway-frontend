import * as React from "react";
import { GenericInputComponent, Spinner, Alert, SelectInputComponent, Card, Accordion } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues, retrieveFormArrayAsOArray,
} from "../utility/inputHandler";
import FlashMessage from 'react-flash-message';

export default function EndpointForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [endpoint, setEndpoint] = React.useState(null);
  const [applications, setApplications] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== "new") {
        getEndpoint();
      }
      getApplications();
    }
  }, [context]);

  const getEndpoint = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/endpoints/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setEndpoint(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });

  }

  const getApplications = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/applications`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setApplications(data['hydra:member']);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const saveEndpoint = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      type: event.target.type.value,
      path: event.target.path.value,
      application: event.target.application.value ? event.target.application.value : null,
    };

    body = removeEmptyObjectValues(body);
    if (!checkValues([body.name, body.type, body.path])) {
      setAlert(null);
      setAlert({ type: 'danger', message: 'Required fields are empty' });
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/endpoints`;
    let method = "POST";
    if (id !== "new") {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("post endpoint")
        // console.log(data)
        setShowSpinner(false);
        setEndpoint(data)
        method === 'POST' && navigate("/endpoints")
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveEndpoint}>
        <Card title="Values"
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={"/endpoints"}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                      <i className="fas fa-long-arrow-alt-left mr-2" />Back
                    </button>
                  </Link>
                  <button
                    className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                    type="submit"
                  >
                    <i className="fas fa-save mr-2" />Save
                  </button>
                </>)
              }}
              cardBody={function () {
                return (
                  <div className="row">
                    <div className="col-12">
                      {showSpinner === true ? (
                        <Spinner />
                      ) : (
                        <>
                          <div className="row">
                            <div className="col-6">
                              {endpoint !== null && endpoint.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={endpoint.name}
                                                       nameOverride={"Name"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"} />
                              )}
                            </div>
                            <div className="col-6">
                              {endpoint !== null && endpoint.description !== null ? (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       data={endpoint.description} nameOverride={"Description"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       nameOverride={"Description"} />
                              )}
                            </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <SelectInputComponent
                                  options={[{ name: "gateway-endpoint", value: "gateway-endpoint" }, { name: 'entity-route', value: 'entity-route' }, { name: 'entity-endpoint', value: 'entity-endpoint' }, { name: 'documentation-endpoint', value: 'documentation-endpoint' }]}
                                  name={"type"} id={"typeInput"}
                                  nameOverride={"Type"}
                                  data={endpoint && endpoint.type ? endpoint.type : "gateway-endpoint"}
                                  required={true} />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                <GenericInputComponent
                                  nameOverride={"Path"}
                                  name={"path"}
                                  data={endpoint && endpoint.path && endpoint.path}
                                  type={"text"}
                                  id={"pathInput"}
                                  required={true}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="form-group">
                                {
                                  applications !== null && applications.length > 0 ? (
                                    <>
                                      {endpoint !== null &&
                                      endpoint.application !== undefined &&
                                      endpoint.application !== null ? (
                                          <SelectInputComponent
                                            options={applications}
                                            data={endpoint.application.name}
                                            name={"application"} id={"applicationInput"} nameOverride={"Applications"}
                                            value={"/admin/applications/"} />
                                        )
                                        : (
                                          <SelectInputComponent
                                            options={applications}
                                            name={"application"} id={"applicationInput"} nameOverride={"Applications"}
                                            value={"/admin/applications/"} />
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[{ name: "Please create a Application.", value: null }]}
                                      name={"application"} id={"applicationInput"} nameOverride={"Applications"}/>
                                  )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
        />
      </form ></>
  );
}