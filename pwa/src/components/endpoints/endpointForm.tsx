import * as React from "react";
import { Spinner, Card, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useForm } from "react-hook-form";
import { InputText, Textarea, SelectMultiple } from "../formFields";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface EndpointFormProps {
  endpointId: string;
}

export const EndpointForm: React.FC<EndpointFormProps> = ({ endpointId }) => {
  const [applications, setApplications] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = endpointId ? "Edit Endpoint" : "Create Endpoint";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  /**
   * Form fields and logic
   */
  const fields = ["name", "path", "description", "applications"];

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const onSubmit = (data): void => {
    data.applications = data.applications?.map((application) => application.value);
    createOrEditEndpoint.mutate({ payload: data, id: endpointId });
  };

  /**
   * Queries and mutations
   */
  const queryClient = useQueryClient();

  const getEndpoint = useQuery<any, Error>(["endpoints", endpointId], () => API.Endpoint.getOne(endpointId), {
    initialData: () => queryClient.getQueryData<any[]>("endpoints")?.find((endpoint) => endpoint.id === endpointId),
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    enabled: !!endpointId,
  });

  const createOrEditEndpoint = useMutation<any, Error, any>(API.Endpoint.createOrUpdate, {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onSuccess: async (newEndpoint) => {
      const previousEndpoints = queryClient.getQueryData<any[]>("endpoints");
      await queryClient.cancelQueries("endpoints");

      if (endpointId) {
        const index = previousEndpoints.findIndex((endpoint) => endpoint.id === endpointId);
        previousEndpoints[index] = newEndpoint;
        queryClient.setQueryData("endpoints", previousEndpoints);
        queryClient.setQueryData(["endpoints", endpointId], newEndpoint);
      }

      if (!endpointId) {
        queryClient.setQueryData("endpoints", [newEndpoint, ...previousEndpoints]);
        queryClient.setQueryData(["endpoints", newEndpoint.id], newEndpoint);
      }

      queryClient.invalidateQueries("endpoints");
      setAlert({ message: `${endpointId ? "Updated" : "Created"} endpoint`, type: "success" });
      navigate("/endpoints");
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSettled: () => {
      setLoadingOverlay(false);
    },
  });

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Endpoint");

    if (getEndpoint.isSuccess) {
      setHeader(
        <>
          Endpoint: <i>{getEndpoint.data.name}</i>
        </>,
      );

      fields.map((field) => {
        setValue(field, getEndpoint.data[field]);
      });
    }
  }, [getEndpoint.isSuccess]);

  React.useEffect(() => {
    handleSetApplications();
    handleSetDocumentation();
  }, [API, endpointId]);

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        const _applications = res.data?.map((application) => {
          return { label: application.name, value: `/admin/applications/${application.id}` };
        });
        setApplications(_applications);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET application error: " + err);
      });
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <a
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#endpointHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </a>
              <Modal
                title="Endpoint Documentation"
                id="endpointHelpModal"
                body={() => (documentation ? <div dangerouslySetInnerHTML={{ __html: documentation }} /> : <Spinner />)}
              />
              <Link className="utrecht-link" to={"/endpoints"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                type="submit"
                disabled={!setApplications}
              >
                <i className="fas fa-save mr-2" />
                Save
              </button>
            </div>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {getEndpoint.isLoading ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText label="Name" name="name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <InputText label="Path" name="path" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea label="Description" name="description" {...{ register, errors }} />
                      </div>
                    </div>
                    <Accordion
                      id="endpointAccordion"
                      items={[
                        {
                          title: "Applications",
                          id: "applicationsAccordion",
                          render: function () {
                            return applications ? (
                              <SelectMultiple
                                label="Applications"
                                name="applications"
                                options={applications}
                                {...{ control, register, errors }}
                              />
                            ) : (
                              <Spinner />
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
export default EndpointForm;
