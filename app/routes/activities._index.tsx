import { Activity } from "~/types/Activity";
import { API_BASE_URL } from "~/utils/constants";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import {
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import DatedActivitiesList from "~/components/DatedActivitiesList";
import Button from "~/components/Button";

export async function loader() {
  const response = await fetch(`${API_BASE_URL}/activities`);
  const data: Activity[] = await response.json();

  const sortedActivities = data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const nonArchivedActivities = sortedActivities.filter(
    (activity) => !activity.is_archived
  );

  const groupedByDate = nonArchivedActivities.reduce((acc, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();

    const existingDate = acc.find((a) => a.date === date);

    if (existingDate) {
      existingDate.activities.push(activity);
    } else {
      acc.push({ date, activities: [activity] });
    }

    return acc;
  }, [] as { date: string; activities: Activity[] }[]);

  return json({
    data: groupedByDate,
    totalActivities: nonArchivedActivities.length,
  });
}

const Index = () => {
  const { data, totalActivities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const actionData = fetcher.data;

  useEffect(() => {
    if (actionData) {
      if (actionData.successfulPromises > 0) {
        toast.success(
          `Successfully archived ${actionData.successfulPromises} activities`
        );
      }

      if (actionData.failedPromises > 0) {
        toast.error(
          `Failed to archive ${actionData.failedPromises} activities`
        );
      }
    }
  }, [actionData]);

  const allActivityIds = data
    .map((datedActivity) =>
      datedActivity.activities.map((activity) => activity.id)
    )
    .flat();

  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">{totalActivities} Activities</h2>
        <fetcher.Form method="POST">
          <input
            type="hidden"
            name="activityIds"
            value={allActivityIds.join(",")}
          />
          <Button isLoading={isLoading}>Archive All</Button>
        </fetcher.Form>
      </div>

      {data.map((datedActivity) => {
        return (
          <DatedActivitiesList
            datedActivity={datedActivity}
            key={datedActivity.date}
          />
        );
      })}
    </div>
  );
};

export default Index;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const activityIds = formData.get("activityIds");

  if (!activityIds) {
    return json({ message: "No activities to archive" }, { status: 400 });
  }

  if (typeof activityIds !== "string") {
    return json({ message: "Invalid activityIds" }, { status: 400 });
  }

  const ids = activityIds.split(",");

  const archivePromises = ids.map((id) =>
    fetch(`${API_BASE_URL}/activities/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_archived: true }),
    })
  );

  const results = await Promise.all(archivePromises);

  const failedPromises = results.filter((result) => !result.ok);

  const successfulPromises = results.filter((result) => result.ok);

  return json({
    failedPromises: failedPromises.length,
    successfulPromises: successfulPromises.length,
  });
};

export function ErrorBoundary() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Oops, something went wrong. Go back to the{" "}
        <a href="/activities" className="underline">
          homepage
        </a>
        .
      </div>
    </div>
  );
}
