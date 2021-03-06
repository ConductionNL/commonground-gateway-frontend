import * as React from "react";
import Layout from "../../components/common/layout";
import EntitiesTable from "../../components/entities/entitiesTable";

const IndexPage = () => {
  return (
    <Layout title={"Entities"} subtext={"An overview of your entity objects"}>
      <title>Gateway - Entities</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <EntitiesTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
