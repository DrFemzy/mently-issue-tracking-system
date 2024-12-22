import { AppError } from "../../utils/error";
import { IProject } from "./model";
import projectRepository from "./repository";

export class ProjectService {
  constructor() {}

  async createProject(
    payload: Pick<IProject, "name" | "description" | "createdBy">
  ) {
    // Check if project already exists
    const existingProject = await projectRepository.findProject({
      name: payload.name,
    });
    if (existingProject) throw new AppError("Project already exists", 400);

    // Create project
    const project = await projectRepository.createProject(payload);
    return {
      status: true,
      code: 201,
      message: "Project created successfully",
      project,
    };
  }

  async getAllProjects() {
    const projects = await projectRepository.getAllProjects();
    return {
      status: true,
      code: 200,
      message: "Projects retrieved successfully",
      projects,
    };
  }

  async updateProject(id: string, payload: Partial<IProject>) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new AppError("Project not found", 404);

    const updatedProject = await projectRepository.updateProject(id, payload);

    return {
      status: true,
      code: 200,
      message: "Project updated successfully",
      updatedProject,
    };
  }

  async deleteProject(id: string) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new AppError("Project not found", 404);

    await projectRepository.deleteProject(id);

    return {
      status: true,
      code: 200,
      message: "Project deleted successfully",
    };
  }
}

const projectService = new ProjectService();
export default projectService;
