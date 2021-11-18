import * as React from "react"
import Layout from "../../components/common/layout";
import EntitiesTable from "../../components/entities/entitiesTable";

const IndexPage = () => {
  return (
    <Layout title={"Entities"} subtext={"An overview of your Entity objects"}>
      <main>
        <div className="row">
          <div className="col-12">
              <EntitiesTable/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
