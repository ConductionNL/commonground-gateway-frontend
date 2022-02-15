import * as React from "react"
import Layout from "../../../../components/common/layout";
import ObjectEntityForm from "../../../../components/objectEntities/ObjectEntityForm";

const IndexPage = (props) => {
  const objectId: string = props.params.objectId === "new" ? null : props.params.objectId
  const entityId: string = props.params.id === "new" ? null : props.params.id
  return (
    <Layout title='Object entity' subtext="Create or edit your object entities">
      <main>
        <div className="row">
          <div className="col-12">
            <ObjectEntityForm {...{objectId, entityId}} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
