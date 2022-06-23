import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useEntity } from "../../hooks/entity";
import { SearchEntity } from "../searchEntity/SearchEntity";

export default function EntitiesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [searchEntityValue, setSearchEntityValue] = React.useState<string>("");
  const [searchEntityParam, setSearchEntityParam] = React.useState<string>("");
  const [pagination, setPagination] = React.useState<number>(1);

  const queryClient = useQueryClient();

  const _useEntity = useEntity(queryClient);
  const getEntities = !searchEntityParam ? _useEntity.getAll(pagination) : _useEntity.search(searchEntityParam);
  const deleteEntity = _useEntity.remove();

  React.useEffect(() => {
    setHeader("Object types");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  const handleSearchObject = (e) => {
    e.preventDefault();
    setSearchEntityParam(searchEntityValue);

    // setSearchEntityValue("");
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

  return (
    <Card
      title={"Object types"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#entityHelpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Object Types Documentation"
              id="entityHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getEntities.isFetching}
              onClick={() => {
                setSearchEntityValue(null);
                setSearchEntityParam(null);
                queryClient.invalidateQueries("entities");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getEntities.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            {/* <button
              className="button-no-style mx-1 utrecht-link"
              onClick={() => {
                navigate("/search-entities");
              }}
            >
              <i className="fas fa-search mr-1" />
              Search
            </button> */}
            <Link to="/entities/new">
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
          <>
            <div className="row">
              <div className="col-12">
                {getEntities.isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <form
                      className="SearchEntity-form mb-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <input
                        value={searchEntityValue ?? ""}
                        onChange={(e) => setSearchEntityValue(e.target.value)}
                        type="text"
                        disabled={getEntities.isLoading}
                        className="FormField-field"
                        placeholder="Search.."
                      />
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          handleSearchObject(e);
                        }}
                        disabled={!searchEntityValue}
                      >
                        {getEntities.isLoading ? "Loading" : "Search"}
                      </button>
                      <button
                        className="button-no-style utrecht-link"
                        disabled={getEntities.isFetching}
                        onClick={() => {
                          setSearchEntityValue(null);
                          setSearchEntityParam(null);
                          queryClient.invalidateQueries("entities");
                        }}
                      >
                        Reset
                      </button>
                    </form>
                    <Table
                      columns={[
                        {
                          headerName: "Name",
                          field: "name",
                        },
                        {
                          headerName: "Endpoint",
                          field: "endpoint",
                        },
                        {
                          headerName: "Path",
                          field: "route",
                        },
                        {
                          headerName: "Source",
                          field: "gateway",
                          valueFormatter: (item) => {
                            return item ? item.name : "";
                          },
                        },
                        {
                          field: "id",
                          headerName: "",
                          renderCell: (item) => {
                            return (
                              <div className="utrecht-link d-flex justify-content-end">
                                <button
                                  className="utrecht-button btn-sm btn-danger mr-2"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#deleteModal${item.id.replace(new RegExp("-", "g"), "")}`}
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                                <DeleteModal
                                  resourceDelete={() => deleteEntity.mutateAsync({ id: item.id })}
                                  resourceId={item.id}
                                />
                                <Link className="utrecht-link d-flex justify-content-end" to={`/entities/${item.id}`}>
                                  <button className="utrecht-button btn-sm btn-success">
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                  </button>
                                </Link>
                              </div>
                            );
                          },
                        },
                      ]}
                      rows={getEntities.data ?? []}
                    />
                    <nav aria-label="...">
                      <ul className="pagination justify-content-center">
                        <li
                          className={"page-item " + (pagination - 1 > 1 ? "disabled" : "")}
                          onClick={() => {
                            if (pagination - 1 > 1) {
                              setPagination(pagination - 1);
                            }
                          }}
                        >
                          <a className="page-link" tabIndex={pagination - 1}>
                            Previous
                          </a>
                        </li>
                        {pagination - 1 > 1 && (
                          <li className="page-item" onClick={() => setPagination(pagination - 1)}>
                            <a className="page-link">{pagination - 1}</a>
                          </li>
                        )}
                        <li className="page-item active">
                          <a className="page-link">
                            {pagination} <span className="sr-only">(current)</span>
                          </a>
                        </li>
                        <li className="page-item" onClick={() => setPagination(pagination + 1)}>
                          <a className="page-link">{pagination + 1}</a>
                        </li>
                        <li className="page-item" onClick={() => setPagination(pagination + 1)}>
                          <a className="page-link">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
