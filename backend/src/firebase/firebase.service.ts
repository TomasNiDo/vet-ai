import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const adminConfig = join(
      process.cwd(),
      this.configService.get<string>('FIREBASE_ADMIN_SDK_PATH')
    );

    try {
      admin.initializeApp({
        credential: admin.credential.cert(require(adminConfig)),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }

  getAuth() {
    return admin.auth();
  }
} 