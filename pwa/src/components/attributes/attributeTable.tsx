import * as React from "react";
import { Table, Spinner, Card } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function AttributeTable({ entityId }) {
  const [attributes, setAttributes] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext)

  React.useEffect(() => { handleSetAttributes() }, [API])

  const handleSetAttributes = () => {
    setShowSpinner(true)
    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        setAttributes(res.data)
      })
      .catch((err) => {
        throw new Error ('GET attributes from entity error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (
    <Card
      title={"Attributes"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-toggle="modal"
              data-target="helpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetAttributes}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/entities/${entityId}/attributes/new`}>
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
              {showSpinner === true ? (
                <Spinner />
              ) : attributes ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link className="utrecht-link d-flex justify-content-end" to={`/entities/${entityId}/attributes/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={attributes}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
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
