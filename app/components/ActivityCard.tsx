import { Link } from "@remix-run/react";
import {
  PhoneMissed,
  Voicemail,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";

import { Activity } from "~/types/Activity";
import { datetimeConverter } from "~/utils/timeConverter";

export interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <Link
      prefetch="intent"
      unstable_viewTransition
      to={`/activities/${activity.id}`}
      key={activity.id}
      className="my-3 p-4 block border border-gray-500 rounded-xl animate-in"
    >
      <div className="flex justify-between">
        <div className="flex flex-col space-y-3">
          {activity.call_type === "missed" ? (
            <PhoneMissed className="text-red-500 h-10 w-10" />
          ) : activity.call_type === "voicemail" ? (
            <Voicemail className="text-blue-500 h-10 w-10" />
          ) : activity.direction === "inbound" ? (
            <PhoneIncoming className="text-green-500 h-10 w-10" />
          ) : (
            <PhoneOutgoing className="text-green-500 h-10 w-10" />
          )}
          <span>{datetimeConverter(activity.created_at)}</span>
        </div>
        <div className="flex flex-col text-xl text-right justify-between">
          <div>
            <span className="text-gray-600 text-sm">From: </span>
            {activity.from ?? "N/A"}
          </div>
          <div>
            <span className="text-gray-600 text-sm">To: </span>
            {activity.to ?? "N/A"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;
