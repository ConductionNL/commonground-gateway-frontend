import * as React from "react";
import { Link } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import MultiDimensionalArrayInput from "../common/multiDimensionalArrayInput";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  TextareaGroup,
  Accordion,
  Spinner,
  Card,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { MIMETypes } from "../../data/mimeTypes";
import MultiSelect from "../common/multiSelect";
import Application from "../../apiService/resources/application";

interface AttributeFormProps {
  attributeId: string;
  entityId: string;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ attributeId, entityId }) => {
  const [attribute, setAttribute] = React.useState<any>(null);
  const [attributes, setAttributes] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = attributeId ? "Edit Attribute" : "Create Attribute";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader(
      <>
        Attribute <i>{attribute && attribute.name}</i>
      </>,
    );
  }, [setHeader, attribute]);

  React.useEffect(() => {
    handleSetAttributes();
    attributeId && handleSetAttribute();
  }, [API, attributeId]);

  React.useEffect(() => {
    if (attributeId) {
      if ((!attribute || !attributes) && !showSpinner) setShowSpinner(true);

      if (attribute && attributes) setShowSpinner(false);
    }
  }, [attribute, attributes]);

  const handleSetAttribute = () => {
    API.Attribute.getOne(attributeId)
      .then((res) => {
        setAttribute(res.data);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET attribute error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("attributes")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleSetAttributes = () => {
    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        const _attributes = res.data.map((attribute) => ({
          name: attribute.name,
          value: `/admin/attributes/${attribute.id}`,
        }));
        setAttributes(_attributes);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET attributes error: " + err);
      });
  };

  const saveAttribute = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let attributeEnum = retrieveFormArrayAsOArray(event.target, "enum");
    let fileTypes = retrieveFormArrayAsOArray(event.target, "fileTypes");
    let allOf = retrieveFormArrayAsOArray(event.target, "allOf");
    let anyOf = retrieveFormArrayAsOArray(event.target, "anyOf");
    let oneOf = retrieveFormArrayAsOArray(event.target, "oneOf");
    let forbiddenIf = retrieveFormArrayAsOArray(event.target, "forbiddenIf");
    let requiredIf = retrieveFormArrayAsObject(event.target, "requiredIf");
    let objectConfig = retrieveFormArrayAsObject(event.target, "objectConfig");

    let body: any = {
      entity: `/admin/entities/${entityId}`,
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      type: event.target.type.value,
      format: event.target.format.value ?? null,
      persistToGateway: event.target.persistToGateway.checked,
      cascade: event.target.cascade.checked,
      searchable: event.target.searchable.checked,
      required: event.target.required.checked,
      mustBeUnique: event.target.mustBeUnique.checked,
      multiple: event.target.multiple.checked,
      nullable: event.target.nullable.checked,
      writeOnly: event.target.writeOnly.checked,
      readOnly: event.target.readOnly.checked,
      deprecated: event.target.deprecated.checked,
      defaultValue: event.target.defaultValue.value ?? null,
      example: event.target.example.value ?? null,
      maxFileSize: event.target.maxFileSize.value ? parseInt(event.target.maxFileSize.value) : null,
      multipleOf: event.target.multipleOf.value ? parseInt(event.target.multipleOf.value) : null,
      maximum: event.target.maximum.value ? parseInt(event.target.maximum.value) : null,
      minimum: event.target.minimum.value ? parseInt(event.target.minimum.value) : null,
      exclusiveMaximum: event.target.exclusiveMaximum.checked,
      exclusiveMinimum: event.target.exclusiveMinimum.checked,
      maxLength: event.target.maxLength.value ? parseInt(event.target.maxLength.value) : null,
      minLength: event.target.minLength.value ? parseInt(event.target.minLength.value) : null,
      maxItems: event.target.maxItems.value ? parseInt(event.target.maxItems.value) : null,
      minItems: event.target.minItems.value ? parseInt(event.target.minItems.value) : null,
      maxDate: event.target.maxDate.value ?? null,
      minDate: event.target.minDate.value ?? null,
      uniqueItems: event.target.uniqueItems.checked,
      minProperties: event.target.minProperties.value ? parseInt(event.target.minProperties.value) : null,
      maxProperties: event.target.maxProperties.value ? parseInt(event.target.minProperties.value) : null,
      inversedBy: event.target.inversedBy.value ?? null,
      fileTypes,
      attributeEnum,
      allOf,
      oneOf,
      anyOf,
      forbiddenIf,
      requiredIf,
      objectConfig,
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.type])) {
      setAlert({ title: "Oops something went wrong", type: "danger", message: "Required fields are empty" });
      setLoadingOverlay(false);
      return;
    }

    API.Attribute.createOrUpdate(body, attributeId)
      .then((res) => {
        setAlert({ message: `${attributeId ? "Updated" : "Created"} attribute`, type: "success" });
        setAttribute(res.data);
        navigate(`/entities/${entityId}`, {
          state: { activeTab: "attributes" },
        });
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", type: "danger", message: err.message });
        throw new Error(`Create or update application error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <form id="attributeForm" onSubmit={saveAttribute}>
      <Card
        title={title}
        cardHeader={() => {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#attributeHelpModal"
                onClick={() => {
                  !documentation && handleSetDocumentation();
                }}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Attribute Documentation"
                id="attributeHelpModal"
                body={() => (documentation ? <div dangerouslySetInnerHTML={{ __html: documentation }} /> : <Spinner />)}
              />
              <Link className="utrecht-link" to={`/entities/${entityId}`} state={{ activeTab: "attributes" }}>
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
        cardBody={() => {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={attribute?.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "String", value: "string" },
                            { name: "Array", value: "array" },
                            { name: "Integer", value: "integer" },
                            { name: "Boolean", value: "boolean" },
                            { name: "Object", value: "object" },
                            { name: "Date", value: "date" },
                            { name: "Datetime", value: "datetime" },
                            { name: "Number", value: "number" },
                            { name: "Float", value: "float" },
                            { name: "File", value: "file" },
                          ]}
                          name={"type"}
                          id={"typeInput"}
                          nameOverride={"Type"}
                          data={attribute?.type}
                          required
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        {attributes ? (
                          <SelectInputComponent
                            options={attributes}
                            data={`/admin/attributes/${attribute?.inversedBy?.id}`}
                            name={"inversedBy"}
                            id={"inversedByInput"}
                            nameOverride={"inversedBy"}
                          />
                        ) : (
                          <SelectInputComponent
                            options={[{ name: "Please create a attribute to use inversedBy", value: null }]}
                            name={"inversedBy"}
                            id={"inversedByInput"}
                            nameOverride={"inversedBy"}
                          />
                        )}
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "Email", value: "email" },
                            { name: "Phone", value: "phone" },
                            { name: "Country code", value: "countryCode" },
                            { name: "BSN", value: "bsn" },
                            { name: "Url", value: "url" },
                            { name: "UUID", value: "uuid" },
                            { name: "Json", value: "json" },
                          ]}
                          name={"format"}
                          id={"formatInput"}
                          nameOverride={"Format"}
                          data={attribute?.format}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"defaultValue"}
                          id={"defaultValueInput"}
                          data={attribute?.defaultValue}
                          nameOverride={"Default Value"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"multipleOf"}
                          id={"multipleOfInput"}
                          data={attribute?.multipleOf}
                          nameOverride={"Multiple Of"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-12">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={attribute?.description}
                        />
                      </div>
                    </div>
                    <Accordion
                      id="attributeAccordion"
                      items={[
                        {
                          title: "Configuration",
                          id: "ConfigAccordion",
                          render: function () {
                            return (
                              <>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"minimum"}
                                      id={"minimumInput"}
                                      data={attribute && attribute.minimum && attribute.minimum}
                                      nameOverride={"Minimum"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"maximum"}
                                      id={"maximumInput"}
                                      data={attribute && attribute.maximum && attribute.maximum}
                                      nameOverride={"Maximum"}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"exclusiveMinimumInput"}
                                        nameLabel={"Exclusive minimum"}
                                        nameAttribute={"exclusiveMinimum"}
                                        data={attribute && attribute.exclusiveMinimum && attribute.exclusiveMinimum}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"exclusiveMaximumInput"}
                                        nameLabel={"Exclusive Maximum"}
                                        nameAttribute={"exclusiveMaximum"}
                                        data={attribute && attribute.exclusiveMaximum && attribute.exclusiveMaximum}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"minLength"}
                                      id={"minLengthInput"}
                                      data={attribute && attribute.minLength && attribute.minLength}
                                      nameOverride={"MinLength"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"maxLength"}
                                      id={"maxLengthInput"}
                                      data={attribute && attribute.maxLength && attribute.maxLength}
                                      nameOverride={"MaxLength"}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"minItems"}
                                      id={"minItemsInput"}
                                      data={attribute && attribute.minItems && attribute.minItems}
                                      nameOverride={"MinItems"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"maxItems"}
                                      id={"maxItemsInput"}
                                      data={attribute && attribute.maxItems && attribute.maxItems}
                                      nameOverride={"MaxItems"}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"text"}
                                      name={"minDate"}
                                      id={"minDateInput"}
                                      data={attribute && attribute.minDate && attribute.minDate}
                                      nameOverride={"MinDate"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"text"}
                                      name={"maxDate"}
                                      id={"maxDateInput"}
                                      data={attribute && attribute.maxDate && attribute.maxDate}
                                      nameOverride={"MaxDate"}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"minProperties"}
                                      id={"minPropertiesInput"}
                                      data={attribute && attribute.minProperties && attribute.minProperties}
                                      nameOverride={"Min Properties"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"number"}
                                      name={"maxProperties"}
                                      id={"maxPropertiesInput"}
                                      data={attribute && attribute.maxProperties && attribute.maxProperties}
                                      nameOverride={"Max Properties"}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"text"}
                                      name={"example"}
                                      id={"exampleInput"}
                                      data={attribute && attribute.example && attribute.example}
                                      nameOverride={"Example"}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <GenericInputComponent
                                      type={"text"}
                                      name={"maxFileSize"}
                                      id={"maxFileSizeInput"}
                                      data={attribute && attribute.maxFileSize && attribute.maxFileSize}
                                      nameOverride={"Max File Size"}
                                    />
                                  </div>
                                </div>
                                <Accordion
                                  id="attributeAccordion"
                                  items={[
                                    {
                                      title: "Required If",
                                      id: "requiredIfAccordion",
                                      render: function () {
                                        return (
                                          <MultiDimensionalArrayInput
                                            id={"requiredIf"}
                                            label={"Required If"}
                                            data={
                                              attribute && attribute.requiredIf
                                                ? [
                                                    {
                                                      key: "requiredIf",
                                                      value: attribute.requiredIf,
                                                    },
                                                  ]
                                                : null
                                            }
                                          />
                                        );
                                      },
                                    },
                                    {
                                      title: "Forbidden If",
                                      id: "forbiddenIfAccordion",
                                      render: function () {
                                        return (
                                          <ElementCreationNew
                                            id={"forbiddenIf"}
                                            label={"Forbidden If"}
                                            data={attribute?.forbiddenIf}
                                          />
                                        );
                                      },
                                    },
                                    {
                                      title: "Object Config",
                                      id: "objectConfigAccordion",
                                      render: function () {
                                        return (
                                          <MultiDimensionalArrayInput
                                            id={"objectConfig"}
                                            label={"Object Config"}
                                            data={
                                              attribute && attribute.objectConfig
                                                ? [
                                                    {
                                                      key: "objectConfig",
                                                      value: attribute.objectConfig,
                                                    },
                                                  ]
                                                : null
                                            }
                                          />
                                        );
                                      },
                                    },
                                  ]}
                                />
                              </>
                            );
                          },
                        },
                        {
                          title: "Validation",
                          id: "ValidationAccordion",
                          render: function () {
                            return (
                              // Here the Validation
                              <>
                                <div className="row form-row">
                                  <div className="col-12 col-sm-6 ">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"persistToGatewayInput"}
                                        nameLabel={"Persist To Gateway"}
                                        nameAttribute={"persistToGateway"}
                                        data={attribute && attribute.persistToGateway && attribute.persistToGateway}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"cascadeInput"}
                                        nameLabel={"Cascade"}
                                        nameAttribute={"cascade"}
                                        data={attribute && attribute.cascade && attribute.cascade}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"requiredInput"}
                                        nameLabel={"Required"}
                                        nameAttribute={"required"}
                                        data={attribute && attribute.required && attribute.required}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"searchableInput"}
                                        nameLabel={"Searchable"}
                                        nameAttribute={"searchable"}
                                        data={attribute && attribute.searchable && attribute.searchable}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"mustBeUniqueInput"}
                                        nameLabel={"Must Be Unique"}
                                        nameAttribute={"mustBeUnique"}
                                        data={attribute && attribute.mustBeUnique && attribute.mustBeUnique}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"uniqueItemsInput"}
                                        nameLabel={"Unique Items"}
                                        nameAttribute={"uniqueItems"}
                                        data={attribute && attribute.uniqueItems && attribute.uniqueItems}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"multipleInput"}
                                        nameLabel={"Multiple"}
                                        nameAttribute={"multiple"}
                                        data={attribute && attribute.multiple && attribute.multiple}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"nullableInput"}
                                        nameLabel={"Nullable"}
                                        nameAttribute={"nullable"}
                                        data={attribute && attribute.nullable && attribute.nullable}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"readOnlyInput"}
                                        nameLabel={"Read Only"}
                                        nameAttribute={"readOnly"}
                                        data={attribute && attribute.readOnly && attribute.readOnly}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"writeOnlyInput"}
                                        nameLabel={"Write Only"}
                                        nameAttribute={"writeOnly"}
                                        data={attribute && attribute.writeOnly && attribute.writeOnly}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <div className="form-check">
                                      <Checkbox
                                        type={"checkbox"}
                                        id={"deprecatedInput"}
                                        nameLabel={"Deprecated"}
                                        nameAttribute={"deprecated"}
                                        data={attribute && attribute.deprecated && attribute.deprecated}
                                        defaultValue={"true"}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Accordion
                                  id="validationAccordion"
                                  items={[
                                    {
                                      title: "File Types",
                                      id: "fileTypesAccordion",
                                      render: function () {
                                        return (
                                          <MultiSelect
                                            id="fileTypes"
                                            label="File Types"
                                            data={attribute?.fileTypes}
                                            options={MIMETypes}
                                          />
                                        );
                                      },
                                    },
                                    {
                                      title: "Enum",
                                      id: "enumAccordion",
                                      render: function () {
                                        return <ElementCreationNew id={"enum"} label={"Enum"} data={attribute?.enum} />;
                                      },
                                    },
                                    {
                                      title: "All Of",
                                      id: "allOfAccordion",
                                      render: function () {
                                        return (
                                          <ElementCreationNew label={"All Of"} id={"allOf"} data={attribute?.allOf} />
                                        );
                                      },
                                    },
                                    {
                                      title: "Any Of",
                                      id: "anyOfAccordion",
                                      render: function () {
                                        return (
                                          <ElementCreationNew label={"Any Of"} id={"anyOf"} data={attribute?.anyOf} />
                                        );
                                      },
                                    },
                                    {
                                      title: "One Of",
                                      id: "oneOfAccordion",
                                      render: function () {
                                        return (
                                          <ElementCreationNew label={"One Of"} id={"oneOf"} data={attribute?.oneOf} />
                                        );
                                      },
                                    },
                                  ]}
                                />
                              </>
                            );
                          },
                        },
                      ]}
                    />
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

export default AttributeForm;
