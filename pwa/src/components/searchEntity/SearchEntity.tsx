import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { Link } from "gatsby";
import * as React from "react";
import "./SearchEntity.css";
import { useQueryClient } from "react-query";
import DeleteModal from "./../../components/deleteModal/DeleteModal";
import { useEntity } from "./../../hooks/entity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@conductionnl/nl-design-system";

export const SearchEntity: React.FC = () => {
  const [searchEntityValue, setSearchEntityValue] = React.useState<string>("");
  const [searchEntityParam, setSearchEntityParam] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useEntity = useEntity(queryClient);

  const searchEntity = _useEntity.search(searchEntityParam);
  const deleteEntity = _useEntity.remove();

  const handleSearchObject = (e) => {
    e.preventDefault();
    setSearchEntityParam(searchEntityValue);

    setSearchEntityValue("");
  };

  return (
    <Card
      cardBody={function () {
        return (
          <div className="SearchEntity">
            <h5>Search a specific Object type</h5>

            <form
              className="SearchEntity-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                value={searchEntityValue}
                onChange={(e) => setSearchEntityValue(e.target.value)}
                type="text"
                disabled={searchEntity.isLoading}
                className="FormField-field"
              />
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  handleSearchObject(e);
                }}
                disabled={!searchEntityValue}
              >
                {searchEntity.isLoading ? "Loading" : "Search"}
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
              rows={searchEntity.data ?? []}
            />
          </div>
        );
      }}
    />
  );
};
