import { PROJECT_STATUS, type Project } from "../project.types";

type Props = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: Props) {
  const statusStyle =
    project.status === PROJECT_STATUS.ACTIVE
      ? "bg-green-100 text-green-700"
      : project.status === PROJECT_STATUS.COMPLETED
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="group relative rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* ACTION BUTTONS */}
      <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(project)}
          className="rounded border bg-white px-2 py-1 text-xs hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project)}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">
          {project.title}
        </h3>

        {project.status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle}`}
          >
            {project.status}
          </span>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
        {project.description || "No description"}
      </p>

      {/* FOOTER */}
      <div className="mt-4 text-xs text-gray-400">
        {project.createdAt &&
          new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
