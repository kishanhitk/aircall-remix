import { Activity } from "~/types/Activity";
import { API_BASE_URL } from "~/utils/constants";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import DatedActivitiesList from "~/components/DatedActivitiesList";

export async function loader() {
  const response = await fetch(`${API_BASE_URL}/activities`);
  const data: Activity[] = await response.json();
  const sortedActivities = data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const archivedActivities = sortedActivities.filter(
    (activity) => activity.is_archived
  );
  const groupedByDate = archivedActivities.reduce((acc, activity) => {
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
    totalActivities: archivedActivities.length,
  });
}

const Index = () => {
  const { data, totalActivities } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      console.log("actionData", actionData);
      if (actionData.successfulPromises > 0) {
        toast.success(
          `Successfully unarchived ${actionData.successfulPromises} activities`
        );
      }

      if (actionData.failedPromises > 0) {
        toast.error(
          `Failed to unarchive ${actionData.failedPromises} activities`
        );
      }
    }
  }, [actionData]);

  const allActivityIds = data
    .map((datedActivity) =>
      datedActivity.activities.map((activity) => activity.id)
    )
    .flat();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">
          {totalActivities} Archieved Activities
        </h2>
        <form method="POST">
          <input
            type="hidden"
            name="activityIds"
            value={allActivityIds.join(",")}
          />
          {allActivityIds.length > 0 ? (
            <button className="bg-gray-900 text-white rounded-md py-2 px-5">
              Unarchive All
            </button>
          ) : null}
        </form>
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
      body: JSON.stringify({ is_archived: false }),
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
