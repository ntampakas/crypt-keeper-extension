import classNames from "classnames";

import { Header } from "@src/ui/components/Header";
import { IdentityList } from "@src/ui/components/IdentityList";

import { TabList, Info, ActivityList } from "./components";
import "./home.scss";
import { useHome } from "./useHome";

const Home = (): JSX.Element => {
  const { identities, connectedIdentity, refreshConnectionStatus } = useHome();

  return (
    <div className="w-full h-full flex flex-col home" data-testid="home-page">
      <Header />

      <div className={classNames("flex flex-col flex-grow flex-shrink overflow-y-auto home__scroller")}>
        <Info refreshConnectionStatus={refreshConnectionStatus} />

        <TabList>
          <IdentityList
            isShowAddNew
            isShowMenu
            identities={identities}
            selectedCommitment={connectedIdentity?.commitment}
          />

          <ActivityList />
        </TabList>
      </div>
    </div>
  );
};

export default Home;
