import * as React from "react";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

interface ObjectEntitiesTableProps {
  entityId: string,
}

const ObjectEntitiesTable:React.FC<ObjectEntitiesTableProps> = ({ entityId }) => {
  const [objectEntities, setObjectEntities] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => { entityId && handleSetObjectEntities() }, [API, entityId])

  const handleSetObjectEntities = () => {
    setShowSpinner(true)
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        setObjectEntities(res.data)
      })
      .catch((err) => {
        throw new Error ('GET object entities error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (<>
    <Card
      title={"Object entities"}
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
            <a className="utrecht-link" onClick={handleSetObjectEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/entities/${entityId}/object_entities/new`}>
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
              ) : objectEntities ? (
                <Table
                  columns={[
                    {
                      headerName: "Uri",
                      field: "uri",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link className="utrecht-link d-flex justify-content-end" to={`/entities/${entityId}/object_entities/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
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
                      headerName: "Uri",
                      field: "uri",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                  ]}
                  rows={[]}
                />
              )}
            </div>
          </div>
        );
      }}
    /></>
  );
}

export default ObjectEntitiesTable
