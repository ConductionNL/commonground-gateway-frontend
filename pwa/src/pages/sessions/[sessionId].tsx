import { Card, Modal } from "@conductionnl/nl-design-system";
import { navigate } from "gatsby-link";
import * as React from "react";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import Spinner from "../../components/common/spinner";
import LogsTable from "../../components/logs/logTable/logTable";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = (props) => {
  const [logs, setLogs] = React.useState(null);
  const [logsDocumentation, setLogsDocumentation] = React.useState(null);
  const [_, setHeader] = React.useContext(HeaderContext);
  const [__, setAlert] = React.useContext(AlertContext);

  const API: APIService = React.useContext(APIContext);
  const sessionId: string = props.params.sessionId;

  React.useEffect(() => {
    setHeader("Session");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    API.Log.getAllFromSession(sessionId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        navigate("/");
        setAlert({ message: "Error getting session logs", type: "danger" });
        throw new Error(`GET Session Logs error: ${err}`);
      });
  };

  const handleSetLogsDocumentation = (): void => {
    API.Documentation.get("logs")
      .then((res) => {
        setLogsDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error(`GET Logs documentation error: ${err}`);
      });
  };

  return (
    <Card
      title={`All logs in session: ${sessionId}`}
      cardBody={() => (logs ? <LogsTable {...{ logs }} /> : <Spinner />)}
      cardHeader={() => (
        <>
          <button
            className="utrecht-link button-no-style"
            data-bs-toggle="modal"
            data-bs-target="#logsHelpModal"
            onClick={handleSetLogsDocumentation}
          >
            <i className="fas fa-question mr-1" />
            <span className="mr-2">Help</span>
          </button>
          <Modal
            title="Logs Documentation"
            id="logsHelpModal"
            body={() =>
              logsDocumentation ? <div dangerouslySetInnerHTML={{ __html: logsDocumentation }} /> : <Spinner />
            }
          />
          <a className="utrecht-link" onClick={handleSetLogs}>
            <i className="fas fa-sync-alt mr-1" />
            <span className="mr-2">Refresh</span>
          </a>
        </>
      )}
    />
  );
};

export default IndexPage;
