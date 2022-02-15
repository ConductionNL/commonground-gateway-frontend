import * as React from "react";
import {
  GenericInputComponent,
  Spinner,
  Alert,
  SelectInputComponent,
  Card,
  Accordion
} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import {Link} from "gatsby";
import {navigate} from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues,
} from "../utility/inputHandler";
import FlashMessage from 'react-flash-message';
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

interface EndpointFormProps {
  endpointId: string,
}

export const EndpointForm: React.FC<EndpointFormProps> = ({endpointId}) => {

  const [context, setContext] = React.useState(null);
  const [endpoint, setEndpoint] = React.useState<any>(null);
  const [applications, setApplications] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const title: string = (endpointId === "new") ? "Create Endpoint" : "Edit Endpoint"

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (endpointId !== "new") {
        getEndpoint();
      }
      getApplications();
    }
  }, [context]);
  console.log({id:endpointId})

  const getEndpoint = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/endpoints/${endpointId}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
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
        setAlert({type: 'danger', message: error.message});
      });

  }

  const getApplications = () => {
    fetch(`${context.adminUrl}/applications`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setApplications(data['hydra:member']);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const saveEndpoint = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      type: event.target.type.value,
      path: event.target.path.value,
      application: event.target.application.value ? event.target.application.value : null,
    };

    body = removeEmptyObjectValues(body);
    if (!checkValues([body["name"], body["type"], body["path"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/endpoints`;
    let method = "POST";
    if (endpointId !== "new") {
      url = `${url}/${endpointId}`;
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
        setLoadingOverlay(false);
        setEndpoint(data)
        method === 'POST' && navigate("/endpoints")
      })
      .catch((error) => {
        setLoadingOverlay(false);
        console.error(error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      })
      .finally(() => {
        setLoadingOverlay(false);
      })
  };

  return (
    <>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveEndpoint}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <div>
                <Link className="utrecht-link" to={"/endpoints"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                  type="submit"
                  disabled={!applications}
                >
                  <i className="fas fa-save mr-2"/>Save
                </button>
              </div>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    <div>
                    {loadingOverlay && <LoadingOverlay /> }
                      <div className="row">
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"name"}
                            id={"nameInput"}
                            data={endpoint && endpoint.name && endpoint.name}
                            nameOverride={"Name"}
                          />
                        </div>
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"description"}
                            id={"descriptionInput"}
                            data={endpoint && endpoint.description && endpoint.description}
                            nameOverride={"Description"}
                          />
                        </div>
                      </div>
                      <br/>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <SelectInputComponent
                              options={[
                                {name: "gateway-endpoint", value: "gateway-endpoint"},
                                {name: 'entity-route', value: 'entity-route'},
                                {name: 'entity-endpoint', value: 'entity-endpoint'},
                                {name: 'documentation-endpoint', value: 'documentation-endpoint'}
                              ]}
                              name={"type"}
                              id={"typeInput"}
                              nameOverride={"Type"}
                              data={endpoint && endpoint.type ? endpoint.type : "gateway-endpoint"}
                              required={true}/>
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
                                      name={"application"}
                                      id={"applicationInput"}
                                      nameOverride={"Applications"}
                                      value={"/admin/applications/"}/>
                                  ) : (
                                    <SelectInputComponent
                                      options={applications}
                                      name={"application"}
                                      id={"applicationInput"}
                                      nameOverride={"Applications"}
                                      value={"/admin/applications/"}/>
                                  )}
                                </>
                              ) : (
                                <SelectInputComponent
                                  data="Please wait, gettings applications from the Gateway..."
                                  options={[{
                                    name: "Please wait, gettings applications from the Gateway...",
                                    value: "Please wait, gettings applications from the Gateway..."
                                  }]}
                                name={"application"} id={"applicationInput"} nameOverride={"Applications"} disabled />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      </form>
    </>
  );
}
export default EndpointForm
