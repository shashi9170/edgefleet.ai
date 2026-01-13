import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../features/auth/auth.api";
import {
  useGetMyProjectsQuery,
  useDeleteProjectMutation,
} from "../features/projects/project.api";
import {
  PROJECT_STATUS,
  type Project,
} from "../features/projects/project.types";
import Modal from "../components/common/Modal";
import ProjectForm from "../features/projects/components/ProjectForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useGetMyProjectsQuery();

  /* ======================
     MODAL STATES
  ====================== */
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteProjectMutation();

  /* ======================
     HANDLERS
  ====================== */
  const openEdit = (project: Project) => {
    setSelectedProject(project);
    setEditOpen(true);
  };

  const openDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const closeAll = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject.id);
    closeAll();
  };

  /* ======================
     STATES
  ====================== */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load projects.
      </div>
    );
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === PROJECT_STATUS.ACTIVE
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === PROJECT_STATUS.COMPLETED
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 p-6 space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* BACK / HOME BUTTON */}
          <button
            onClick={() => navigate("/")}
            title="Go to Home"
            className="rounded-lg border bg-white p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            ←
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-500">
              Here’s a quick overview of your projects
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 shadow"
        >
          + New Project
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Projects"
          value={totalProjects}
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          label="Active Projects"
          value={activeProjects}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          label="Completed Projects"
          value={completedProjects}
          gradient="from-blue-500 to-blue-600"
        />
      </div>

      {/* ================= EMPTY STATE ================= */}
      {totalProjects === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            No projects yet
          </h3>
          <p className="mt-2 text-gray-500">
            Start by creating your first project.
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Create Project
          </button>
        </div>
      )}

      {/* ================= PROJECTS GRID ================= */}
      {totalProjects > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-white p-6 shadow hover:shadow-lg transition"
            >
              {/* ACTIONS */}
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openEdit(project)}
                  className="rounded-lg border bg-white px-2 py-1 text-xs hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDelete(project)}
                  className="rounded-lg bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium
                    ${
                      project.status === PROJECT_STATUS.ACTIVE
                        ? "bg-green-100 text-green-700"
                        : project.status === PROJECT_STATUS.COMPLETED
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {project.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                {project.description || "No description provided"}
              </p>

              {project.createdAt && (
                <div className="mt-4 text-xs text-gray-400">
                  Created on{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      <Modal
        isOpen={createOpen}
        onClose={closeAll}
        title="Create Project"
      >
        <ProjectForm onSuccess={closeAll} onCancel={closeAll} />
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        isOpen={editOpen}
        onClose={closeAll}
        title="Edit Project"
      >
        {selectedProject && (
          <ProjectForm
            project={selectedProject}
            onSuccess={closeAll}
            onCancel={closeAll}
          />
        )}
      </Modal>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <Modal
        isOpen={deleteOpen}
        onClose={closeAll}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {selectedProject?.title}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 rounded bg-red-600 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>

            <button
              onClick={closeAll}
              className="flex-1 rounded border py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow bg-linear-to-r ${gradient}`}>
      <p className="text-sm opacity-90">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
