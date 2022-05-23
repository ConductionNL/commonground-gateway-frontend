import * as React from "react";
import { Card, Spinner } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Link } from "gatsby";

interface ObjectEntityFormNewProps {
  objectId?: string;
  entityId: string;
}

export const ObjectEntityFormNew: React.FC<ObjectEntityFormNewProps> = ({ objectId, entityId }) => {
  const API: APIService = React.useContext(APIContext);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [createdObjectId, setCreatedObjectId] = React.useState(null);
  const [formIOEndpoint, setFormIOEndpoint] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);

  React.useEffect(() => {
    getFormIOEndpoint();
  }, [API]);

  React.useEffect(() => {
    if (!formIOEndpoint) return;
    getFormIOSchema();
  }, [formIOEndpoint]);

  const getFormIOEndpoint = () => {
    API.FormIO.getEntityCrudEndpoint(entityId)
      .then((res) => {
        setFormIOEndpoint(res.data.endpoint);
      })
      .catch((err) => {
        throw new Error("GET form.io endpoint error: " + err);
      });
  };

  const getFormIOSchema = () => {
    API.FormIO.getSchema(formIOEndpoint + (objectId ? `/${objectId}` : createdObjectId ? `/${createdObjectId}` : ""))
      .then((res) => {
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      });
  };

  React.useEffect(() => {
    if (!formIOSchema) return;

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(<Form src={formIOSchema} onSubmit={saveObject} />);
    });
  }, [formIOSchema]);

  const saveObject = (event) => {
    let body = event.data;
    body.submit = undefined;

    if (!objectId && !createdObjectId) {
      API.ApiCalls.createObject(formIOEndpoint, body)
        .then((res) => {
          getFormIOSchema();
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        });
    }
    if (objectId || createdObjectId) {
      API.ApiCalls.updateObject(formIOEndpoint, objectId ?? createdObjectId, body)
        .then((res) => {
          setCreatedObjectId(res.data.id);
          getFormIOSchema();
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        });
    }
  };

  return (
    <Card
      title={objectId ? "Edit" : "Create"}
      cardHeader={function () {
        return (
          <div>
            <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#helpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Link className="utrecht-link" to={`/entities/${entityId}`} state={{ activeTab: "objects" }}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />
                Back
              </button>
            </Link>
          </div>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">{showSpinner ? <Spinner /> : formIO && formIO}</div>
          </div>
        );
      }}
    />
  );
};
export default ObjectEntityFormNew;
