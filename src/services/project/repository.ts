import Project, { IProject } from "./model";

export class ProjectRepository {
  constructor() {}

  async createProject(
    payload: Pick<IProject, "name" | "description" | "createdBy">
  ): Promise<IProject> {
    const project = (await Project.create(payload)).populate("createdBy");
    return project;
  }

  async findProject(payload: Partial<IProject>) {
    const project = await Project.findOne({ ...(payload as any) })
      .populate("createdBy")
      .exec();
    return project;
  }

  async getAllProjects() {
    const project = await Project.find().populate("createdBy").exec();
    return project;
  }

  async findProjectById(id: string): Promise<IProject | null> {
    const project = await Project.findById(id).populate("createdBy").exec();
    return project;
  }

  async updateProject(
    id: string,
    payload: Partial<IProject>
  ): Promise<IProject | null> {
    const project = await Project.findByIdAndUpdate(id, payload, {
      new: true,
    })
      .populate("createdBy")
      .exec();
    return project;
  }

  async deleteProject(id: string): Promise<IProject | null> {
    const project = await Project.findByIdAndDelete(id);
    // Project can be stored in a database or cache for later use
    return project;
  }
}

const projectRepository = new ProjectRepository();
export default projectRepository;
