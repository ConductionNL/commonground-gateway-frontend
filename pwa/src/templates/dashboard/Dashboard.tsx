import * as React from "react";
import "./dashboard.css";
import { DashboardCard, DashboardCardSmall } from "./../../components/dashboardCard/DashboardCard";
import CallHealthQuickview from "./../../components/callHealthQuickview/CallHealthQuickview";
import LogsTable from "../../components/logs/logTable/logTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import applicationsIcon from "./../../images/icon-applications.svg";
import sourcesIcon from "./../../images/icon-sources.svg";
import endpointsIcon from "./../../images/icon-endpoints.svg";
import conductionIcon from "./../../images/icon-conduction.svg";
import Spinner from "../../components/common/spinner";
import { Card, Modal } from "@conductionnl/nl-design-system";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";
import { useEndpoint } from "../../hooks/endpoint";
import { useLog } from "../../hooks/log";
import { useSource } from "../../hooks/source";

const Dashboard: React.FC = () => {
  const [logsDocumentation, setLogsDocumentation] = React.useState(null);
  const API: APIService = React.useContext(APIContext);

  const queryClient = useQueryClient();

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpoints = _useEndpoint.getAll();

  const _useApplication = useApplication(queryClient);
  const getApplications = _useApplication.getAll();

  const _useLog = useLog();
  const getAllIncomingLogs = _useLog.getAllIncoming();

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();

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
    <div className="dashboard">
      <div>
        <h3 className="dashboard-dividerTitle">Quick overview</h3>
        <div className="dashboard-quickOverview">
          <DashboardCard
            amount={getApplications.isSuccess ? getApplications.data.length : 0}
            title="Applications"
            iconBackgroundColor="6861CE"
            icon={<img src={applicationsIcon} alt="applications" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={3} unhealthyCallsAmount={1} />}
            linkTo="/applications"
          />

          <DashboardCard
            amount={getSources.isSuccess ? getSources.data.length : 0}
            title="Sources"
            iconBackgroundColor="FFAD46"
            icon={<img src={sourcesIcon} alt="sources" />}
            subtitle={<CallHealthQuickview healthyCallsAmount={18} unhealthyCallsAmount={3} />}
            linkTo="sources"
          />

          <DashboardCard
            amount={getEndpoints.isSuccess ? getEndpoints.data.length : 0}
            title="Endpoints"
            iconBackgroundColor="31CE36"
            icon={<img src={endpointsIcon} alt="endpoints" />}
            subtitle="View all endpoints"
            linkTo="endpoints"
          />
        </div>
      </div>

      <div className="dashboard-row-logsAndDocumentation">
        <div className="dashboard-logsTable">
          <h3 className="dashboard-dividerTitle">Recent activity</h3>

          <Card
            title="Incoming calls"
            cardBody={() =>
              getAllIncomingLogs.isLoading ? <Spinner /> : <LogsTable logs={getAllIncomingLogs.data ?? []} />
            }
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
                <button
                  className="button-no-style utrecht-link"
                  disabled={getAllIncomingLogs.isFetching}
                  onClick={() => {
                    getAllIncomingLogs.refetch();
                  }}
                >
                  <i className="fas fa-sync-alt mr-1" />
                  <span className="mr-2">{getAllIncomingLogs.isFetching ? "Fetching data..." : "Refresh"}</span>
                </button>
              </>
            )}
          />
        </div>

        <div className="dashboard-externalLinks">
          <h3 className="dashboard-dividerTitle">Documentation and support</h3>

          <DashboardCardSmall
            title="Documentation"
            subtitle="View the Read The Docs"
            iconBackgroundColor="979797"
            icon={<FontAwesomeIcon icon={faBook} />}
            linkTo="https://commonground-gateway.readthedocs.io/en/latest/"
          />

          <DashboardCardSmall
            title="Conduction"
            subtitle="Get in touch"
            iconBackgroundColor="4276FC"
            icon={<img src={conductionIcon} alt="conduction" />}
            linkTo="https://conduction.nl"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
