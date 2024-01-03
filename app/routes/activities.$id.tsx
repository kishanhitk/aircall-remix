import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Activity } from "~/types/Activity";
import { API_BASE_URL } from "~/utils/constants";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  const response = await fetch(`${API_BASE_URL}/activities/${id}`);
  const data: Activity = await response.json();

  return json({ activity: data });
};

const Index = () => {
  const { activity } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();

  useEffect(() => {
    if (actionData) {
      console.log(actionData);
      if (actionData.success) {
        toast.success(
          `Activity ${actionData.newArchivedStatus ? "archived" : "unarchived"}`
        );
      } else {
        toast.error("Failed to archive activity");
      }
    }
  }, [actionData]);

  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";

  return (
    <div>
      <h1>{activity.id}</h1>
      <p>{activity.is_archived ? "Archived" : "Not Archived"}</p>
      <fetcher.Form method="POST">
        <input
          type="hidden"
          name="is_archived"
          value={activity.is_archived.toString()}
        />
        <button className="bg-gray-900 text-white rounded-md m-4 p-4">
          {activity.is_archived ? "Unarchive" : "Archive"}
          {isLoading && "..."}
        </button>
      </fetcher.Form>
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
