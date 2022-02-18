import * as React from "react";
import Spinner from "../common/spinner";
import {
  GenericInputComponent,
  Accordion,
  SelectInputComponent,
  Alert,
  Card,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray
} from "../utility/inputHandler";
import {navigate} from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew"
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import FlashMessage from 'react-flash-message';
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

interface ObjectEntityFormProps {
  objectId: string,
  entityId: string,
}

export const ObjectEntityForm: React.FC<ObjectEntityFormProps> = ({objectId, entityId}) => {
  const [objectEntity, setObjectEntity] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [applications, setApplications] = React.useState<any>(null);
  const API: APIService = React.useContext(APIContext);
  const title: string = objectId ? "Edit object" : "Create object";
  const [documentation, setDocumentation] = React.useState<string>(null)

  React.useEffect(() => {
    objectId && handleSetEntity_object()
    handleSetApplications()
    handleSetDocumentation()
  }, [API, objectId])

  const handleSetEntity_object = () => {
    setShowSpinner(true)

    API.ObjectEntity.getOne(objectId)
      .then((res) => {
        setObjectEntity(res.data)
      })
      .catch((err) => {
        throw new Error('GET object entity error: ' + err)
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
        throw new Error('GET applications error: ' + err)
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
  };

  const saveObjectEntity = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let errors = retrieveFormArrayAsOArray(event.target, "errors");
    let promises = retrieveFormArrayAsOArray(event.target, "promises");
    let externalResult = retrieveFormArrayAsOArray(event.target, "externalResult");

    let body: {} = {
      uri: event.target.uri.value,
      externalId: event.target.externalId ? event.target.externalId.value : null,
      application: event.target.application.value
        ? event.target.application.value
        : null,
      organization: event.target.organization.value
        ? event.target.organization.value
        : null,
      owner: event.target.owner.value ? event.target.owner.value : null,
      entity: `/admin/entities/${entityId}`,
      errors,
      promises,
      externalResult,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["uri"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setLoadingOverlay(false);
      return;
    }

    if (!objectId) { // unset id means we're creating a new entry
      API.ObjectEntity.create(body)
        .then(() => {
          navigate(`/entities/${entityId}`)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('CREATE object entity error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false)
        })
    }

    if (objectEntity) { // set id means we're updating a existing entry
      API.ObjectEntity.update(body, objectId)
        .then((res) => {
          setObjectEntity(res.data)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('UPDATE object entity error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false)
        })
    }
  }

  return (
    <div>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveObjectEntity}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <>
                <button
                  className="utrecht-link button-no-style"
                  data-bs-toggle="modal"
                  data-bs-target="#ObjectEntityHelpModal"
                  onClick={(e) => e.preventDefault()}
                >
                  <Modal
                    title="Entity_object Documentation"
                    id="ObjectEntityHelpModal"
                    body={() => (
                      <div dangerouslySetInnerHTML={{ __html: documentation }} />
                    )}
                  />
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                <Link className="utrecht-link" to={`/entities/${entityId}`}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>
                    Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                  type="submit"
                  disabled={!applications}
                >
                  <i className="fas fa-save mr-2"/>
                  Save
                </button>
              </>
            );
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    <>
                      {loadingOverlay && <LoadingOverlay/>}
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <GenericInputComponent
                              type={"url"}
                              name={"uri"}
                              id={"uriInput"}
                              data={objectEntity && objectEntity.uri && objectEntity.uri}
                              nameOverride={"Uri"}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <GenericInputComponent
                              type={"text"}
                              name={"externalId"}
                              id={"externalIdInput"}
                              data={objectEntity && objectEntity.externalId && objectEntity.externalId}
                              nameOverride={"External Id"}
                            />
                          </div>
                        </div>
                      </div>
                      <br/>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            {
                              applications !== null && applications.length > 0 ? (
                                <SelectInputComponent
                                  options={applications}
                                  name={"application"}
                                  id={"applicationInput"}
                                  nameOverride={"Application"}
                                  data={objectEntity?.application.id}/>
                              ) : (
                                <SelectInputComponent
                                  data="Please wait, gettings applications from the Gateway..."
                                  options={[{
                                    name: "Please wait, gettings applications from the Gateway...",
                                    value: "Please wait, gettings applications from the Gateway..."
                                  }]}
                                  name={"application"} id={"applicationInput"} nameOverride={"Application"} disabled/>
                              )}
                          </div>
                        </div>
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"organization"}
                            id={"organizationInput"}
                            data={objectEntity && objectEntity.organization && objectEntity.organization}
                            nameOverride={"Organization"}
                          />
                        </div>
                      </div>
                      <br/>
                      <div className="row">
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"owner"}
                            id={"ownerInput"}
                            data={objectEntity && objectEntity.owner && objectEntity.owner}
                            nameOverride={"Owner"}
                          />
                        </div>
                      </div>

                      <Accordion
                        id="objectEntityAccordion"
                        items={[
                          {
                            title: "Errors",
                            id: "errorsAccordion",
                            render: function () {
                              return (
                                <>
                                  <ElementCreationNew
                                    id="errors"
                                    label="Errors"
                                    data={objectEntity?.errors}
                                  />
                                </>
                              );
                            }
                          },
                          {
                            title: "Promises",
                            id: "promisesAccordion",
                            render: function () {
                              return (
                                <>
                                  <ElementCreationNew
                                    id="promises"
                                    label="Promises"
                                    data={objectEntity?.promises}
                                  />
                                </>
                              );
                            }
                          },
                          {
                            title: "External Result",
                            id: "externalResultAccordion",
                            render: function () {
                              return (
                                <>
                                  <ElementCreationNew
                                    id="externalResult"
                                    label="External Result"
                                    data={objectEntity?.externalResult}
                                  />
                                </>
                              );
                            },
                          }
                        ]}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          }}
        />
      </form>
    </div>
  )
}

export default ObjectEntityForm
