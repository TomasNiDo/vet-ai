import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto, AddMedicalRecordDto } from './dto/pet.dto';

@Controller('pets')
@UseGuards(FirebaseAuthGuard)
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  async listPets(@Request() req) {
    try {
      console.log('List pets request from user:', req.user.uid);
      const pets = await this.petService.listPets(req.user.uid);
      console.log('Successfully retrieved pets:', pets.length);
      return pets;
    } catch (error) {
      console.error('Detailed controller error - List pets:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack,
        user: req.user?.uid,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to list pets',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createPet(@Request() req, @Body() dto: CreatePetDto) {
    try {
      return await this.petService.createPet(req.user.uid, dto);
    } catch (error) {
      console.error('Controller error - Create pet:', error);
      throw new HttpException(
        'Failed to create pet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getPet(@Request() req, @Param('id') id: string) {
    try {
      return await this.petService.getPet(id, req.user.uid);
    } catch (error) {
      console.error('Controller error - Get pet:', error);
      throw new HttpException(
        'Failed to get pet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updatePet(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdatePetDto,
  ) {
    try {
      return await this.petService.updatePet(id, req.user.uid, dto);
    } catch (error) {
      console.error('Controller error - Update pet:', error);
      throw new HttpException(
        'Failed to update pet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deletePet(@Request() req, @Param('id') id: string) {
    try {
      return await this.petService.deletePet(id, req.user.uid);
    } catch (error) {
      console.error('Controller error - Delete pet:', error);
      throw new HttpException(
        'Failed to delete pet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/medical-records')
  async addMedicalRecord(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AddMedicalRecordDto,
  ) {
    try {
      return await this.petService.addMedicalRecord(id, req.user.uid, dto);
    } catch (error) {
      console.error('Controller error - Add medical record:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to add medical record',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/medical-records/:recordId')
  async updateMedicalRecord(
    @Request() req,
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @Body() dto: AddMedicalRecordDto,
  ) {
    try {
      return await this.petService.updateMedicalRecord(id, recordId, req.user.uid, dto);
    } catch (error) {
      console.error('Controller error - Update medical record:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update medical record',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
