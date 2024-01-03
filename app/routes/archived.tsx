import { Activity } from "~/types/Activity";
import { API_BASE_URL } from "~/utils/constants";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export async function loader() {
  const response = await fetch(`${API_BASE_URL}/activities`);
  const data: Activity[] = await response.json();

  const archivedActivities = data.filter((activity) => activity.is_archived);
  return json({ archivedActivities });
}

const Index = () => {
  const { archivedActivities } = useLoaderData<typeof loader>();
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

  return (
    <div>
      <form method="POST">
        <input
          type="hidden"
          name="activityIds"
          value={archivedActivities.map((activity) => activity.id)}
        />
        <button className="bg-gray-900 text-white rounded-md m-4 p-4">
          Unarchive All
        </button>
      </form>
      {archivedActivities.map((activity: Activity) => {
        return (
          <Link
            unstable_viewTransition
            to={`/activities/${activity.id}`}
            key={activity.id}
            className="m-4 p-4 block border border-black"
          >
            {activity.id}
          </Link>
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
