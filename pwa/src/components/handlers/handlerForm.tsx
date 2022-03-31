import * as React from "react";
import { Link } from "gatsby";
import { Accordion, Spinner, Card, Modal } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { validateJSON } from "../../services/validateJSON";
import { useForm } from "react-hook-form";
import {
  CreateArray,
  CreateKeyValue,
  InputNumber,
  InputText,
  SelectMultiple,
  SelectSingle,
  Textarea,
} from "../formFields";
import { ISelectValue } from "../formFields/types";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

interface HandlerFormProps {
  handlerId: string;
  endpointId: string;
}

export const HandlerForm: React.FC<HandlerFormProps> = ({ handlerId, endpointId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [entities, setEntities] = React.useState(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const title: string = handlerId ? "Edit Handler" : "Create Handler";
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const templateTypeSelectOptions: ISelectValue[] = [
    { label: "Twig", value: "twig" },
    { label: "Markdown", value: "markdown" },
    { label: "Restructured Text", value: "restructuredText" },
  ];

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay(true);

    data.endpoints = [`/admin/endpoints/${endpointId}`];
    data.templateType = data.templateType && data.templateType.value;
    data.entity = data.entity && data.entity.value;
    data.translationIn = data.translationIn && data.translationIn;
    data.translationOut = data.translationOut && data.translationOut;

    API.Handler.createOrUpdate(data, handlerId)
      .then(() => {
        setAlert({ message: `${handlerId ? "Updated" : "Created"} Handler`, type: "success" });
        navigate(`/endpoints/${endpointId}/handlers`);
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update handler error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  const handleSetFormValues = (handler): void => {
    const basicFields: string[] = [
      "name",
      "description",
      "sequence",
      "template",
      "conditions",
      "mappingIn",
      "mappingOut",
      "translationsIn",
      "translationsOut",
      "skeletonIn",
      "skeletonOut",
    ];
    basicFields.forEach((field) => setValue(field, handler[field]));

    setValue(
      "templateType",
      templateTypeSelectOptions.find((option) => handler.templateType === option.value),
    );

    handler.entity && setValue("entity", { label: handler.entity.name, value: `/admin/entities/${handler.entity.id}` });
  };

  React.useEffect(() => {
    setHeader("Create Handler");
    handleSetTableNames();
    handlerId && handleSetHandler();
    handleSetEntities();
  }, [API, handlerId]);

  const handleSetHandler = () => {
    setShowSpinner(true);

    API.Handler.getOne(handlerId)
      .then((res) => {
        const handler = res.data;

        setHeader(
          <>
            Handler <i>{handler && handler.name}</i>
          </>,
        );

        handleSetFormValues(handler);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET handler error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetEntities = () => {
    API.Entity.getAll()
      .then((res) => {
        setEntities(resourceArrayToSelectArray(res.data, "entities"));
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET entities error: " + err);
      });
  };

  const handleSetTableNames = () => {
    API.Translation.getTableNames()
      .then((res) => {
        const names = res.data?.results.map((name) => ({ label: name, value: name }));
        setTableNames(names);
      })
      .catch((err) => {
        throw new Error("GET table names error: " + err);
      });
  };

  return (
    <form id="handlerForm" onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#handlerHelpModal"
                type="button"
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Handler Documentation"
                id="handlerHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: "" }} />}
              />
              <Link className="utrecht-link" to={`/endpoints/${endpointId}`} state={{ activeTab: "handlers" }}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
                <i className="fas fa-save mr-2" />
                Save
              </button>
            </>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner ? (
                  <Spinner />
                ) : (
                  <>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <Textarea name="description" label="Description" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputNumber
                          name="sequence"
                          label="Sequence"
                          {...{ register, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="templateType"
                          label="Template type"
                          options={templateTypeSelectOptions}
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="template" label="Template" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <SelectSingle name="entity" label="Entity" options={entities ?? []} {...{ control, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea
                          name="conditions"
                          label={"Conditions (JSON Logic)"}
                          tooltipContent={
                            <a target="_blank" href="https://docs.conductor-gateway.app/en/latest/features/handlers/">
                              Read more about the use of JSON Logic
                            </a>
                          }
                          {...{ register, errors }}
                          validation={{ validate: () => validateJSON(getValues("conditions")), required: true }}
                        />
                      </div>
                    </div>
                    <Accordion
                      id="handlerAccordion"
                      items={[
                        {
                          title: "Translations in",
                          id: "translationsInAccordion",
                          render: () =>
                            tableNames ? (
                              <SelectMultiple
                                name="translationsIn"
                                label="Translations in"
                                options={tableNames ?? []}
                                {...{ control, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                        {
                          title: "Translations out",
                          id: "translationsOutAccordion",
                          render: () =>
                            tableNames ? (
                              <SelectMultiple
                                name="translationsOut"
                                label="Translations out"
                                options={tableNames ?? []}
                                {...{ control, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                        {
                          title: "Mapping in",
                          id: "mappingInAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="mappingIn"
                              label="Mapping in"
                              data={getValues("mappingIn")}
                              {...{ control, errors }}
                            />
                          ),
                        },
                        {
                          title: "Mapping out",
                          id: "mappingOutAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="mappingOut"
                              label="Mapping out"
                              data={getValues("mappingOut")}
                              {...{ control, errors }}
                            />
                          ),
                        },
                        {
                          title: "Skeleton in",
                          id: "skeletonInAccordion",
                          render: () => (
                            <CreateArray
                              name="skeletonIn"
                              label="Skeleton in"
                              data={getValues("skeletonIn")}
                              {...{ control, errors }}
                            />
                          ),
                        },
                        {
                          title: "Skeleton Out",
                          id: "skeletonOutAccordion",
                          render: () => (
                            <CreateArray
                              name="skeletonOut"
                              label="Skeleton out"
                              data={getValues("skeletonOut")}
                              {...{ control, errors }}
                            />
                          ),
                        },
                      ]}
                    />
                  </>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};

export default HandlerForm;
