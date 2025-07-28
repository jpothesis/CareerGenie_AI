import { TopBar } from "./TopBar";
import { Grid } from "./Grid";
import { DashboardProvider } from "../../context/DashboardContext"; 

export const Dashboard = () => {
  return (
    <DashboardProvider>
      <div className="bg-white rounded-lg pb-4 shadow">
        <TopBar />
        <Grid />
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
