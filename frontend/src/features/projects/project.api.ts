import { baseApi } from "../../services/baseApi";
import { nanoid } from "@reduxjs/toolkit";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "./project.types";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET MY PROJECTS
    getMyProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (response: {
        status: number;
        success: boolean;
        message: string;
        data: Project[];
      }) => response.data,
    }),


    // CREATE PROJECT
    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),

      transformResponse: (response: {
        status: number;
        success: boolean;
        message: string;
        data: Project;
      }) => response.data,

      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempId = nanoid();
    
        const patchResult = dispatch(
          projectApi.util.updateQueryData(
            "getMyProjects",
            undefined,
            (draft) => {
              draft.unshift({
                id: tempId,
                title: body.title,
                description: body.description,
                status: body.status,
                createdAt: new Date().toISOString(),
            });
          }
        )
      );

      try {
        const { data } = await queryFulfilled;
  
        dispatch(
          projectApi.util.updateQueryData(
            "getMyProjects",
            undefined,
            (draft) => {
              const index = draft.findIndex((p) => p.id === tempId);
              if (index !== -1) {
                draft[index] = data;
              }
            }
          )
        );
      } catch {
        patchResult.undo();
      }
      },
    }),


    // UPDATE PROJECT
    updateProject: builder.mutation<Project, UpdateProjectRequest>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData(
            "getMyProjects",
            undefined,
            (draft) => {
              const project = draft.find((p) => p.id === id);
              if (project) Object.assign(project, patch);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

  
    // DELETE PROJECT
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData(
            "getMyProjects",
            undefined,
            (draft) => {
              const index = draft.findIndex((p) => p.id === id);
              if (index !== -1) draft.splice(index, 1);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
