import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function SourcesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [sources, setSources] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Sources");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetSources();
  }, [API]);

  const handleSetSources = () => {
    setShowSpinner(true);
    API.Source.getAll()
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Sources error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("sources")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleDeleteSource = (id): void => {
    if (confirm(`Do you want to delete this source?`)) {
      API.Source.delete(id)
        .then(() => {
          setAlert({ message: `Deleted source`, type: "success" });
          handleSetSources();
        })
        .catch((err) => {
          setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
          throw new Error("DELETE Sources error: " + err);
        });
    }
  };

  return (
    <Card
      title={"Sources"}
      cardHeader={() => {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#sourceHelpModal"
              onClick={() => {
                !documentation && handleSetDocumentation();
              }}
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Source Documentation"
              id="sourceHelpModal"
              body={() => (documentation ? <div dangerouslySetInnerHTML={{ __html: documentation }} /> : <Spinner />)}
            />
            <a className="utrecht-link" onClick={handleSetSources}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/sources/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={() => {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : sources ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Location",
                      field: "location",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button
                              onClick={() => handleDeleteSource(item.id)}
                              className="utrecht-button btn-sm btn-danger mr-2"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <Link className="utrecht-link d-flex justify-content-end" to={`/sources/${item.id}`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={sources}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Location",
                      field: "location",
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
}
