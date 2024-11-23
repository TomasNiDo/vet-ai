import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private database: admin.database.Database;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const adminConfigPath = join(
        process.cwd(),
        this.configService.get<string>('FIREBASE_ADMIN_SDK_PATH') || '',
      );
      console.log('Looking for Firebase config at:', adminConfigPath);

      if (!fs.existsSync(adminConfigPath)) {
        console.error('Firebase config file not found at:', adminConfigPath);
        throw new Error(
          `Firebase admin config file not found at: ${adminConfigPath}`,
        );
      }

      const serviceAccount = JSON.parse(
        fs.readFileSync(adminConfigPath, 'utf8')
      );

      // Initialize Firebase Admin if not already initialized
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
        });
      }

      // Initialize Realtime Database
      this.database = admin.database();
      console.log('Firebase Realtime Database initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  getAuth() {
    return admin.auth();
  }

  getDatabase() {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    return this.database;
  }
} 