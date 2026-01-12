import { Controller, Post, Get, Patch, Delete, Body, Param, Req, HttpStatus } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create.dto';
import { UpdateProjectDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IApiResponse } from './interfaces/response.interface';
import type { RequestWithUser } from './interfaces/requestWithUser.interface';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

    @Post()
    async create(@Req() req: RequestWithUser, @Body() createDto: CreateProjectDto): Promise<IApiResponse> {

        const project = await this.projectService.create(req.user.id, createDto);
        return {
            status: HttpStatus.CREATED,
            success: true,
            message: 'Project created successfully',
            data: project,
        };
    }

    @Get()
    async findAll(@Req() req: RequestWithUser): Promise<IApiResponse> {

        const projects = await this.projectService.findAll(req.user.id);
        return {
            status: HttpStatus.OK,
            success: true,
            message: 'Projects fetched successfully',
            data: projects,
        };
    }

    @Get(':id')
    async findOne(@Req() req: RequestWithUser, @Param('id') id: string): Promise<IApiResponse> {
        const project = await this.projectService.findOne(req.user.id, id);
        return {
            status: HttpStatus.OK,
            success: true,
            message: 'Project fetched successfully',
            data: project,
        };
    }

    @Patch(':id')
    async update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateDto: UpdateProjectDto ): Promise<IApiResponse> {
        const project = await this.projectService.update(req.user.id, id, updateDto);
        return {
            status: HttpStatus.OK,
            success: true,
            message: 'Project updated successfully',
            data: project,
        };
    }

    @Delete(':id')
    async remove(@Req() req: RequestWithUser, @Param('id') id: string): Promise<IApiResponse> {
        await this.projectService.remove(req.user.id, id);

        return {
            status: HttpStatus.OK,
            success: true,
            message: 'Project deleted successfully',
        };
    }
}
