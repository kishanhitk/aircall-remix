import React from "react";
import ActivityCard from "./ActivityCard";
import { ActivityDate } from "~/types/ActivityDates";

export interface DatedActivitiesListProps {
  datedActivity: ActivityDate;
}
const DatedActivitiesList = ({ datedActivity }: DatedActivitiesListProps) => {
  return (
    <div key={datedActivity.date} className="my-8">
      {new Date(datedActivity.date).toDateString()}
      {datedActivity.activities.map((activity) => {
        return <ActivityCard activity={activity} key={activity.id} />;
      })}
    </div>
  );
};

export default DatedActivitiesList;
