import * as React from "react";
import { Card, Spinner } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Link, navigate } from "gatsby";

interface ObjectEntityFormNewProps {
  objectId?: string;
  entityId: string;
}

export const ObjectEntityFormNew: React.FC<ObjectEntityFormNewProps> = ({ objectId, entityId }) => {
  const API: APIService = React.useContext(APIContext);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [formIOEndpoint, setFormIOEndpoint] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);

  React.useEffect(() => {
    setShowSpinner(true);
    getFormIOEndpoint();
  }, [objectId]);

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
    API.FormIO.getSchema(formIOEndpoint, objectId)
      .then((res) => {
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  React.useEffect(() => {
    if (!formIOSchema) return;
    setShowSpinner(false);

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(<Form src={formIOSchema} onSubmit={saveObject} />);
    });
  }, [formIOSchema]);

  const saveObject = (event) => {
    setShowSpinner(true);
    let body = event.data;

    body.submit = undefined;
    body["@application"] = undefined;
    body["@owner"] = undefined;
    body["@organization"] = undefined;

    if (!objectId) {
      API.ApiCalls.createObject(formIOEndpoint, body)
        .then((res) => {
          setShowSpinner(false);
          setFormIOEndpoint(null);
          setFormIOSchema(null);
          setFormIO(null);
          navigate(`/entities/${entityId}/objects/${res.data.id}`);
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        });
    }
    if (objectId) {
      API.ApiCalls.updateObject(formIOEndpoint, objectId, body)
        .then((res) => {
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
