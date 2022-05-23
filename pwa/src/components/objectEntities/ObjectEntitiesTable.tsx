import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";

interface ObjectEntitiesTableProps {
  entityId: string;
}

const ObjectEntitiesTable: React.FC<ObjectEntitiesTableProps> = ({ entityId }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [objectEntities, setObjectEntities] = React.useState(false);
  const [entityViableForFormIO, setEntityViableForFormIO] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    if (entityId) {
      handleSetObjectEntities();
      checkIfEntityCanUseFormIO();
    }
    handleSetDocumentation();
  }, [API, entityId]);

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
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        res?.data?.length > 0 && setObjectEntities(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET object entities error: " + err);
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

  const handleDeleteObjectEntity = (id): void => {
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

  return (
    <Card
      title={"Objects"}
      cardHeader={function () {
        return (
          <>
            {entityViableForFormIO === false && (
              <p className="utrecht-paragraph text-left">
                To create or edit objects, his entity needs a handler, which needs to have endpoints with GET, POST and
                PUT methods
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
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/entities/${entityId}/objects/${item.id}`}
                            >
                              <button className="utrecht-button btn-sm btn-success" disabled={!entityViableForFormIO}>
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
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
