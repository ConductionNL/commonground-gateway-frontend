import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationForm from "../../components/translations/translationForm";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import TranslationTable from "../../components/translations/translationTable";

const IndexPage = (props) => {
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);

  return (
    <Layout title={"Translation"} subtext={"Create or modify your translation"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Add", id: "overview", active: true },
                    { name: "Translations", id: "translations"}
                  ]}
                />
              ) : (
                <Tabs
                  items={[{name: "Overview", id: "overview", active: true}]}
                />
              )}

            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview-tab"
              >
                <br />
                <TranslationForm id={props.params.id} />
              </div>
              <div
                className="tab-pane"
                id="translations"
                role="tabpanel"
                aria-labelledby="translations-tab"
              >
                <br />

               <TranslationTable id={props.params.id}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
