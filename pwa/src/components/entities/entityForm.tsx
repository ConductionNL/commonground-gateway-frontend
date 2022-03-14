import * as React from "react";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  Card,
  Modal,
  Spinner,
  TextareaGroup,
} from "@conductionnl/nl-design-system/lib";
import {navigate} from "gatsby-link";
import {Link} from "gatsby";
import {checkValues, removeEmptyObjectValues} from "../utility/inputHandler";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import {AlertContext} from "../../context/alertContext";
import {HeaderContext} from "../../context/headerContext";

interface EntityFormProps {
  entityId: string;
}

export const EntityForm: React.FC<EntityFormProps> = ({entityId}) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [entity, setEntity] = React.useState<any>(null);
  const [sources, setSources] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = entityId ? "Edit Object type" : "Create Object type";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Object Type");
  }, [setHeader, entity]);


  React.useEffect(() => {
    handleSetSources();
    entityId && handleSetEntity();
  }, [API, entityId]);

  const handleSetEntity = () => {
    setShowSpinner(true);

    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        setAlert({title: "Oops something went wrong", message: err, type: "danger"});
        throw new Error("GET entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetSources = () => {
    API.Source.getAll()
      .then((res) => {
        const _sources = res.data.map((source) => ({
          name: source.name,
          value: `/admin/gateways/${source.id}`,
        }));
        setSources(_sources);
      })
      .catch((err) => {
        setAlert({title: "Oops something went wrong", message: err, type: "danger"});
        throw new Error("GET sources error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("object_types")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({title: "Oops something went wrong", message: err, type: "danger"});
        throw new Error("GET documentation error: " + err);
      });
  };

  const saveEntity = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body: any = {
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      route: event.target.route.value ?? null,
      endpoint: event.target.endpoint.value ?? null,
      gateway: event.target.gateway.value ?? null,
      extend: event.target.extend.checked,
      function: event.target.function.value ?? null,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
      setAlert({title: "Oops something went wrong", type: "danger", message: "Required fields are empty"});
      setLoadingOverlay(false);
      return;
    }

    API.Entity.createOrUpdate(body, entityId)
      .then(() => {
        setAlert({ message: `${entityId ? "Updated" : "Saved"} object type`, type: "success" });
        navigate("/entities");
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", type: "danger", message: err.message });
        throw new Error("Create or update entity error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <form id="dataForm" onSubmit={saveEntity}>
      <Card
        title={title}
        cardHeader={() => {
          return (
            <div>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#entityHelpModal"
                onClick={() => {
                  !documentation && handleSetDocumentation()
                }}
              >
                <i className="fas fa-question mr-1"/>
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Object Type Documentation"
                id="entityHelpModal"
                body={() =>
                  documentation ? (
                    <div dangerouslySetInnerHTML={{__html: documentation}}/>
                  ) : (
                    <Spinner/>
                  )
                }
              />
              <Link className="utrecht-link" to={"/entities"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2"/>
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit" disabled={!sources}>
                <i className="fas fa-save mr-2"/>
                Save
              </button>
            </div>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay/>}
                    <div className="row form-row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={entity?.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            {name: "Organization", value: "organization"},
                            {name: "User", value: "user"},
                            {name: "User group", value: "userGroup"},
                          ]}
                          data={entity?.function ?? null}
                          name={"function"}
                          id={"functionInput"}
                          nameOverride={"Function"}
                          required
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"endpoint"}
                          id={"endpointInput"}
                          data={entity?.endpoint}
                          nameOverride={"Endpoint"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"route"}
                          id={"routeInput"}
                          data={entity?.route}
                          nameOverride={"Route"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={
                            sources !== null && sources.length > 0
                              ? sources
                              : [{ name: "Please create a source  first.", value: null }]
                          }
                          data={entity?.gateway?.name}
                          name={"source"}
                          id={"sourceInput"}
                          nameOverride={"Source"}
                          value={"admin/gateways/"}
                        />
                      </div>
                      <div className="col-6">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={entity?.description}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-12">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"extendInput"}
                            nameLabel={"Extend"}
                            nameAttribute={"extend"}
                            data={entity && entity.extend && entity.extend}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};
export default EntityForm;
