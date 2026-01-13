import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsGrid from "../components/ProjectsGrid";
import ProjectForm from "../components/ProjectForm";
import Modal from "../../../components/common/Modal";
import {
  useDeleteProjectMutation,
} from "../project.api";
import type { Project } from "../project.types";

export default function ProjectsPage() {
  const navigate = useNavigate();

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

  return (
    <section className="space-y-6 rounded-2xl bg-gray-50 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* BACK TO HOME */}
          <button
            onClick={() => navigate("/")}
            title="Go to Home"
            className="rounded-lg border bg-white p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            ←
          </button>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Projects
            </h2>
            <p className="text-sm text-gray-500">
              Manage and track your ongoing work
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="text-lg leading-none">＋</span>
          Create Project
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* ================= PROJECTS GRID ================= */}
      <ProjectsGrid
        onEdit={openEdit}
        onDelete={openDelete}
      />

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
    </section>
  );
}
