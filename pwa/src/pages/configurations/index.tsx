import * as React from "react";
import ConfigurationsExportButton from "../../components/configurationsExportButton/ConfigurationsExportButton";
import { HeaderContext } from "../../context/headerContext";

const IndexPage = () => {
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({
      title: "Configurations",
      subText: "Manage your configurations here"
    });
  }, [setHeader]);

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="utrecht-page col-3">
            <ConfigurationsExportButton />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
