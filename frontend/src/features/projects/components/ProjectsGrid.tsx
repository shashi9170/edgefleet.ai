import { useGetMyProjectsQuery } from "../project.api";
import ProjectCard from "./ProjectCard";
import ProjectEmpty from "./ProjectEmpty";
import type { Project } from "../project.types";

type Props = {
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectsGrid({ onEdit, onDelete }: Props) {
  const { data: projects, isLoading } = useGetMyProjectsQuery();

  if (isLoading) {
    return <p className="text-gray-500">Loading projects...</p>;
  }

  if (!projects || projects.length === 0) {
    return <ProjectEmpty />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
