import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/database/schemas/project.schema';
import { CreateProjectDto } from './dto/create.dto';
import { UpdateProjectDto } from './dto/update.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {}

    // Create a new project
    async create(userId: string, createDto: CreateProjectDto): Promise<Project> {
        const project = await this.projectModel.create({
        ...createDto,
        userId,
        });

        
        return project;
    }

    // Get all projects of the user
    async findAll(userId: string): Promise<Project[]> {
        return this.projectModel.find({ userId }).exec();
    }

    // Get one project (must belong to user)
    async findOne(userId: string, projectId: string): Promise<Project> {
        const project = await this.projectModel.findOne({ _id: projectId, userId }).exec();
        if (!project) throw new NotFoundException('Project not found');
        
        return project;
    }

    // Update a project (must belong to user)
    async update( userId: string, projectId: string, updateDto: UpdateProjectDto, ): Promise<Project> {
        const project = await this.projectModel.findOne({ _id: projectId, userId });
        
        if (!project) throw new NotFoundException('Project not found');

        Object.assign(project, updateDto);

        return project.save();
    }

    // Delete a project (must belong to user)
    async remove(userId: string, projectId: string): Promise<{ deleted: boolean }> {
        const project = await this.projectModel.findOne({ _id: projectId, userId });

        if (!project) throw new NotFoundException('Project not found');

        await project.deleteOne();

        return { deleted: true };
    }
}
