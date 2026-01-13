import { useState } from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../project.api";
import {
  PROJECT_STATUS,
  type Project,
  type ProjectStatus,
} from "../project.types";

type Props = {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(
    project?.description ?? ""
  );

  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? PROJECT_STATUS.ACTIVE
  );

  const [createProject] = useCreateProjectMutation();
  const [updateProject, { isLoading }] =
    useUpdateProjectMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      await updateProject({
        id: project!.id,
        title,
        description,
        status,
      }).unwrap();
    } else {
      await createProject({
        title,
        description,
        status,
      }).unwrap();
    }

    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6"
    >
      <h2 className="text-lg font-semibold">
        {isEdit ? "Edit Project" : "Create Project"}
      </h2>

      <input
        autoFocus
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border px-3 py-2"
        placeholder="Project title"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border px-3 py-2"
        placeholder="Description"
      />

      {/* ✅ FIXED */}
      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as ProjectStatus)
        }
        className="w-full rounded border px-3 py-2"
      >
        <option value={PROJECT_STATUS.ACTIVE}>Active</option>
        <option value={PROJECT_STATUS.COMPLETED}>
          Completed
        </option>
        <option value={PROJECT_STATUS.ON_HOLD}>
          On Hold
        </option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded bg-indigo-600 py-2 text-white disabled:opacity-60"
        >
          {isEdit ? "Update Project" : "Create Project"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded border py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
