import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";
import { deleteItem } from "../../services/mutateQueries";

interface ObjectEntitiesTableProps {
  entityId: string;
}

const ObjectEntitiesTable: React.FC<ObjectEntitiesTableProps> = ({ entityId }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [objectEntities, setObjectEntities] = React.useState(false);
  const [handlers, setHandlers] = React.useState(false);
  const [objectsDeletable, setObjectsDeletable] = React.useState(null);
  const [entityViableForFormIO, setEntityViableForFormIO] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    if (entityId) {
      handleSetObjectEntities();
      checkIfEntityCanUseFormIO();
      handleSetHandlers();
    }
    handleSetDocumentation();
  }, [API, entityId]);

  React.useEffect(() => {
    if (handlers && !objectsDeletable !== null) {
      isThisObjectDeletable();
    }
  }, [handlers]);

  const checkIfEntityCanUseFormIO = () => {
    API.FormIO.getEntityCrudEndpoint(entityId)
      .then((res) => {
        setEntityViableForFormIO(res.data.endpoint);
      })
      .catch((err) => {
        throw new Error("GET can use form.io error: " + err);
      });
  };

  const handleSetObjectEntities = () => {
    setObjectEntities(false);
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        setObjectEntities(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET object entities error: " + err);
      });
  };

  const handleSetHandlers = () => {
    API.Handler.getAllFromEntity(entityId)
      .then((res) => {
        setHandlers(res);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET entity error: " + err);
      });
  };

  const syncObject = (objectEntityId: string) => {
    setShowSpinner(true);
    API.ObjectEntity.sync(objectEntityId)
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET object entities error: " + err);
      })
      .finally(() => {
        setAlert({ message: `Object ${objectEntityId} synced`, type: "success" });
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("object_types")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleDeleteObjectEntity = (id: string): void => {
    if (confirm(`Do you want to delete this object entity?`)) {
      API.ObjectEntity.delete(id)
        .then(() => {
          setAlert({ message: "Deleted object entity", type: "success" });
          handleSetObjectEntities();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE object entity error: " + err);
        });
    }
  };

  const isThisObjectDeletable = () => {
    let objectsAreDeletable = false;
    Object.entries(handlers).forEach(([key, handler]) => {
      if (objectsAreDeletable !== true) {
        Object.entries(handler.endpoints).forEach(([key, endpoint]) => {
          if (objectsAreDeletable !== true && (endpoint.method === "DELETE" || endpoint.method === "delete")) {
            objectsAreDeletable = true;
          }
        });
      }
    });
    setObjectsDeletable(objectsAreDeletable);
  };

  return (
    <Card
      title={"Objects"}
      cardHeader={function () {
        return (
          <>
            {entityViableForFormIO === false && (
              <p className="utrecht-paragraph text-left">
                To create or edit objects, this entity needs a handler, which needs to have a GET, POST and PUT
                endpoint.
              </p>
            )}
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#ObjectEntityHelpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Object Entities Documentation"
              id="ObjectEntityHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <a className="utrecht-link" onClick={handleSetObjectEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <button
              className="utrecht-button utrecht-button-sm btn-sm btn-success"
              disabled={!entityViableForFormIO}
              onClick={() => {
                navigate(`/entities/${entityId}/objects/new`);
              }}
            >
              <i className={"fas " + (entityViableForFormIO == null ? "fa-spinner" : "fa-plus") + " mr-2"} />
              Create
            </button>
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {objectEntities === false ? (
                <Spinner />
              ) : objectEntities ? (
                <Table
                  columns={[
                    {
                      headerName: "ID",
                      field: "id",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      headerName: "Created",
                      field: "dateCreated",
                      renderCell: (item: { dateCreated: string }) => new Date(item.dateCreated).toLocaleString("nl-NL"),
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string; externalId: string; gateway: { location: string } }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            {item.externalId && item.gateway?.location && (
                              <button
                                onClick={() => {
                                  syncObject(item.id);
                                }}
                                className="utrecht-button btn-sm btn-primary mr-2"
                              >
                                <FontAwesomeIcon icon={faSync} /> Sync
                              </button>
                            )}
                            {objectsDeletable && (
                              <button
                                onClick={() => {
                                  handleDeleteObjectEntity(item.id);
                                }}
                                className="utrecht-button btn-sm btn-danger mr-2"
                              >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                            )}
                            {entityViableForFormIO ? (
                              <Link
                                className="utrecht-link d-flex justify-content-end"
                                to={`/entities/${entityId}/objects/${item.id}`}
                              >
                                <button className="utrecht-button btn-sm btn-success">
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                              </Link>
                            ) : (
                              <button className="utrecht-button btn-sm btn-success" disabled={!entityViableForFormIO}>
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            )}
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={objectEntities}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Id",
                      field: "id",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      headerName: "Created",
                      field: "dateCreated",
                    },
                  ]}
                  rows={[]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default ObjectEntitiesTable;
