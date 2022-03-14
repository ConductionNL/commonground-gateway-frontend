import * as React from "react";
import "./logModal.css";
import { Accordion, Modal, Tabs } from "@conductionnl/nl-design-system";
import { Link, navigate } from "gatsby";
import CodeBlock from "../../common/codeBlock/codeBlock";
import msToSeconds from "../../../services/msToSeconds";
import LabelWithBackground from "../../LabelWithBackground/LabelWithBackground";

interface LogModalProps {
  log: any;
}

const LogModal: React.FC<LogModalProps> = ({ log }) => {
  return (
    <div className="LogModal">
      <Modal
        key={log.id}
        title={"Call log"}
        id={`logs${log.id}`}
        body={function () {
          const statusClass = log.responseStatusCode ? log.responseStatusCode > 199 && log.responseStatusCode < 300 ? "success" : "danger" : "danger";
          return (
            <>
              <Tabs
                items={[
                  { name: "General", id: "logGeneral", active: true },
                  { name: "Request", id: "logRequest" },
                  { name: "Response", id: "logResponse" },
                ]}
              />
              <div className="tab-content">
                <div className="tab-pane active" id="logGeneral" role="tabpanel" aria-labelledby="logGeneral-tab">
                  <table className="mt-3 logTable-table">
                    <tr>
                      <th>Status</th>
                      <td>
                        <LabelWithBackground label={log?.responseStatusCode} type={statusClass} />
                      </td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>{log?.type === "in" ? "Incoming" : "Outcoming"}</td>
                    </tr>
                    <tr>
                      <th>Call ID</th>
                      <td>
                        <Link
                          to={`/calls/${log?.callId}`}
                          aria-label="Close"
                          type="button"
                          data-bs-dismiss="modal"
                          onClick={() => navigate(`/calls/${log?.callId}`)}
                        >
                          {log?.callId}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th>Session ID</th>
                      <td>
                        <Link
                          to={`/sessions/${log?.session}`}
                          aria-label="Close"
                          type="button"
                          data-bs-dismiss="modal"
                          onClick={() => navigate(`/sessions/${log?.session}`)}
                        >
                          {log?.session}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th>Response time</th>
                      <td>{log && `${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>
                    </tr>
                    <tr>
                      <th>Route</th>
                      <td>{log?.routeName}</td>
                    </tr>
                    <tr>
                      <th>Endpoint</th>
                      <td>
                        <Link
                          to={"/endpoints/" + log?.id}
                          type="button"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => {
                            navigate("/endpoints/" + log?.id);
                          }}
                        >
                          {log?.endpoint?.name}
                        </Link>
                      </td>
                    </tr>
                  </table>
                  <Accordion
                    id="logGeneralAccordion"
                    items={[
                      {
                        title: "Session",
                        id: "logRequestSession",
                        backgroundColor: "black",
                        render: function () {
                          return (
                            <>
                              {log.sessionValues ? (
                                <CodeBlock code={JSON.stringify(log.sessionValues)} language="json" />
                              ) : (
                                <p className="utrecht-paragraph">No session values found</p>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
                <div className="tab-pane" id="logRequest" role="tabpanel" aria-labelledby="logRequest-tab">
                  <table className="mt-3 logTable-table">
                    <tr>
                      <th>Method</th>
                      <td>{log?.requestMethod}</td>
                    </tr>
                    <tr>
                      <th>Path info</th>
                      <td>{log?.requestPathInfo}</td>
                    </tr>
                    <tr>
                      <th>Languages</th>
                      <td>{log?.requestLanguages}</td>
                    </tr>
                  </table>
                  <Accordion
                    id="logRequestAccordion"
                    items={[
                      {
                        title: "Headers",
                        id: "logRequestHeaders",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.requestHeaders)) {
                            logs.push({ ...{ key, value } });
                          }
                          return (
                            <>
                              {log.requestHeaders ? (
                                <table className="mt-3 logTable-table">
                                  {logs.map((log, idx) => {
                                    return (
                                      <tr key={log.key + idx}>
                                        <th>{log.key}</th>
                                        <td>{log.value}</td>
                                      </tr>
                                    );
                                  })}
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No headers found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Query paramaters",
                        id: "logRequestQueryparamters",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.requestQuery)) {
                            logs.push({ ...{ key, value } });
                          }
                          return (
                            <>
                              {log.requestQuery ? (
                                <table className="mt-3 logTable-table">
                                  {logs.map((log, idx) => {
                                    return (
                                      <tr key={log.key + idx}>
                                        <th>{log.key}</th>
                                        <td>{log.value}</td>
                                      </tr>
                                    );
                                  })}
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No parameters found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Content",
                        id: "logRequestContent",
                        backgroundColor: "black",
                        render: function () {
                          return (
                            <>
                              {log.requestContent ? (
                                <CodeBlock code={log.requestContent} language="json" />
                              ) : (
                                <p className="utrecht-paragraph">No content found</p>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
                <div className="tab-pane" id="logResponse" role="tabpanel" aria-labelledby="logResponse-tab">
                  <Accordion
                    id="logResponseAccordion"
                    items={[
                      {
                        title: "Headers",
                        id: "logResponseHeaders",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.requestHeaders)) {
                            logs.push({ ...{ key, value } });
                          }

                          return (
                            <>
                              {log.responseHeaders ? (
                                <table className="mt-3 logTable-table">
                                  {logs.map((log, idx) => {
                                    return (
                                      <tr key={log.key + idx}>
                                        <th>{log.key}</th>
                                        <td>{log.value}</td>
                                      </tr>
                                    );
                                  })}
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No headers found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Content",
                        id: "logResponseContent",
                        render: function () {
                          return (
                            <>
                              {log.responseContent ? (
                                <CodeBlock code={log.responseContent} language="json" />
                              ) : (
                                <p className="utrecht-paragraph">No content found</p>
                              )}
                            </>
                          );
                        },
                        backgroundColor: "black",
                      },
                    ]}
                  />
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default LogModal;
