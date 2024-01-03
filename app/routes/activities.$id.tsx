import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeftIcon,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Voicemail,
} from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import { Activity } from "~/types/Activity";
import { API_BASE_URL } from "~/utils/constants";
import { datetimeConverter, millisecondsToHHMMSS } from "~/utils/timeConverter";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  const response = await fetch(`${API_BASE_URL}/activities/${id}`);
  const data: Activity = await response.json();

  return json({ activity: data });
};

const Index = () => {
  const { activity } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const actionData = fetcher.data;

  useEffect(() => {
    if (actionData) {
      if (!actionData.success) {
        toast.error("Failed to archive activity");
      }
    }
  }, [actionData]);

  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-x-1 text-gray-600"
      >
        <ArrowLeftIcon className="inline cursor-pointer h-5 w-5" /> Go back
      </button>

      <div
        key={activity.id}
        className="my-3 p-4 block border border-gray-500 rounded-xl"
      >
        <div className="flex justify-between">
          <div className="flex flex-col space-y-3 text-xl">
            <div>
              <span className="text-gray-600 text-sm">ID: </span>
              {activity.id ?? "N/A"}
            </div>
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
            <div>
              <span className="text-gray-600 text-sm">Duration: </span>
              {millisecondsToHHMMSS(activity.duration) ?? "N/A"}
            </div>
          </div>
          <div className="flex flex-col text-xl text-right space-y-3">
            <fetcher.Form method="POST">
              <input
                type="hidden"
                name="is_archived"
                value={activity.is_archived === true ? "true" : "false"}
              />
              <Button isLoading={isLoading}>
                {activity.is_archived ? (
                  <div className="flex items-center">
                    <ArchiveRestore className="inline mr-2" />
                    Unarchive
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Archive className="inline mr-2" />
                    Archive
                  </div>
                )}
              </Button>
            </fetcher.Form>
            <div>
              <span className="text-gray-600 text-sm">From: </span>
              {activity.from ?? "N/A"}
            </div>
            <div>
              <span className="text-gray-600 text-sm">To: </span>
              {activity.to ?? "N/A"}
            </div>

            <div>
              <span className="text-gray-600 text-sm">Via: </span>
              {activity.via ?? "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const id = params.id;
  const formData = await request.formData();
  const isArchived = formData.get("is_archived") === "true";

  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_archived: !isArchived }),
  });

  if (response.ok) {
    return json(
      {
        message: "Activity archived",
        success: response.ok,
        newArchivedStatus: !isArchived,
      },
      { status: 200 }
    );
  } else {
    return json(
      { message: "Failed to archive activity", success: response.ok },
      { status: 500 }
    );
  }
};

export default Index;
