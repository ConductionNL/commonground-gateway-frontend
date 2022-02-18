import * as React from "react";
import {
  GenericInputComponent,
  SelectInputComponent,
  TextareaGroup,
  Spinner,
  Card,
  Alert,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import {navigate} from "gatsby-link";
import {Link} from "gatsby";
import FlashMessage from 'react-flash-message';
import {checkValues, removeEmptyObjectValues} from "../utility/inputHandler";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from '../loadingOverlay/loadingOverlay'


interface EndpointFormProps {
  endpointId: string,
}

export const EndpointForm: React.FC<EndpointFormProps> = ({endpointId}) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const [endpoint, setEndpoint] = React.useState<any>(null);
  const [applications, setApplications] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = endpointId ? "Edit Endpoint" : "Create Endpoint";
  const API: APIService = React.useContext(APIContext)
  const [documentation, setDocumentation] = React.useState<string>(null)

  React.useEffect(() => {
    handleSetApplications()
    handleSetDocumentation()
    endpointId && handleSetEndpoint()
  }, [API, endpointId])

  const handleSetEndpoint = () => {
    setShowSpinner(true)

    API.Endpoint.getOne(endpointId)
      .then((res) => {
        setEndpoint(res.data)
      })
      .catch((err) => {
        throw new Error('GET endpoints error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        setApplications(res.data)
      })
      .catch((err) => {
        throw new Error('GET application error: ' + err)
      })
  }

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  }


  const saveEndpoint = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      path: event.target.path.value,
      application: event.target.application.value ?? null,
      type: "gateway-endpoint",
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["path"]])) {
      return;
    }

    if (!endpointId) { // unset id means we're creating a new entry
      API.Endpoint.create(body)
        .then(() => {
          navigate(`/endpoints`)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Create endpoint error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }

    if (endpointId) { // set id means we're updating a existing entry
      API.Endpoint.update(body, endpointId)
        .then((res) => {
          setEndpoint(res.data)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Update endpoint error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }
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
                <button
                  className="utrecht-link button-no-style"
                  data-bs-toggle="modal"
                  data-bs-target="#endpointHelpModal"
                  onClick={(e) => e.preventDefault()}
                >
                  <Modal
                    title="Endpoint Documentation"
                    id="endpointHelpModal"
                    body={() => (
                      <div dangerouslySetInnerHTML={{__html: documentation}}/>
                    )}
                  />
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                <Link className="utrecht-link" to={"/endpoints"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrecht-button-sm btn-sm btn-success"
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
                      {loadingOverlay && <LoadingOverlay/>}
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
                          {
                            applications !== null && applications.length > 0 ? (
                              <SelectInputComponent
                                options={applications}
                                name={"application"}
                                id={"applicationInput"}
                                nameOverride={"Application"}
                                data={endpoint?.application.id}/>
                            ) : (
                              <SelectInputComponent
                                data="Please wait, gettings applications from the Gateway..."
                                options=
                                  {[{
                                    name: "Please wait, gettings applications from the Gateway...",
                                    value: "Please wait, gettings applications from the Gateway..."
                                  }]}
                                name={"application"}
                                id={"applicationInput"}
                                nameOverride={"Application"}
                                disabled
                              />
                            )}
                        </div>
                      </div>
                      <br/>
                      <div className="row">
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
                        <div className="col-6">
                          <TextareaGroup
                            name={"description"}
                            id={"descriptionInput"}
                            defaultValue={endpoint?.description}
                          />
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
