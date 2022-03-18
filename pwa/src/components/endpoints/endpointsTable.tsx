import * as React from "react";
import { Card, Table, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function EndpointsTable() {
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const queryClient = useQueryClient();
  const getEndpointsQuery = useQuery<any[], Error>("endpoints", API.Endpoint.getAll);
  const deleteEndpointMutation = useMutation<any, Error, any>(API.Endpoint.delete);

  React.useEffect(() => {
    setHeader("Endpoints");
  }, [setHeader]);

  React.useEffect(() => {
    getEndpointsQuery.isError && setAlert({ message: getEndpointsQuery.error.message, type: "danger" });
  }, [getEndpointsQuery.isError]);

  React.useEffect(() => {
    deleteEndpointMutation.isError && setAlert({ message: deleteEndpointMutation.error.message, type: "danger" });

    if (deleteEndpointMutation.isSuccess) {
      deleteEndpointMutation.isSuccess && setAlert({ message: "Deleted endpoint", type: "success" });
      queryClient.invalidateQueries("endpoints");
    }
  }, [deleteEndpointMutation.isError, deleteEndpointMutation.isSuccess]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get("endpoints")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Endpoints"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#endpointHelpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Endpoint Documentation"
              id="endpointHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getEndpointsQuery.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("endpoints");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getEndpointsQuery.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to="/endpoints/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {getEndpointsQuery.isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Table
                    columns={[
                      {
                        headerName: "Name",
                        field: "name",
                      },
                      {
                        headerName: "Path",
                        field: "path",
                      },
                      {
                        field: "id",
                        headerName: " ",
                        renderCell: (item: { id: string }) => {
                          return (
                            <div className="utrecht-link d-flex justify-content-end">
                              <button
                                className="utrecht-button btn-sm btn-danger mr-2"
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteModal${item.id.replace(new RegExp("-", "g"), "")}`}
                              >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                              <DeleteModal resourceDelete={deleteEndpointMutation.mutateAsync} resourceId={item.id} />
                              <Link className="utrecht-link d-flex justify-content-end" to={`/endpoints/${item.id}`}>
                                <button className="utrecht-button btn-sm btn-success">
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                              </Link>
                            </div>
                          );
                        },
                      },
                    ]}
                    rows={getEndpointsQuery.data ?? []}
                  />
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
