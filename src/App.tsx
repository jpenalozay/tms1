/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from "./components/layout/MainLayout";
import { PlannerView } from "./views/PlannerView";
import { DashboardView } from "./views/DashboardView";
import { useTMSStore } from "./store/useStore";

export default function App() {
  const activeView = useTMSStore(s => s.activeView);

  return (
    <MainLayout>
      {activeView === 'planner' ? <PlannerView /> : <DashboardView />}
    </MainLayout>
  );
}

