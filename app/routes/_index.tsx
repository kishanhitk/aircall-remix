import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { ExternalLink } from "lucide-react";
import Button from "~/components/Button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="max-w-2xl mx-auto p-4 text-center my-60">
      <h1 className="text-2xl my-5 animate-in">
        Submission by{" "}
        <a href="https://kishans.in" className="underline decoration-wavy">
          Kishan
        </a>
      </h1>
      <Link to="/activities" className="block animate-in " prefetch="render">
        <Button>Explore Activities</Button>
      </Link>
      <p className="animate-in my-5">
        Checkout the source code on{" "}
        <a
          href="https://github.com/kishanhitk/aircall-remix"
          className="inline items-center "
        >
          Github
          <ExternalLink className="inline h-4 w-4 ml-1 mb-1" />
        </a>
      </p>
    </div>
  );
}
