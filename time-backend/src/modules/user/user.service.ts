import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getOrCreateDefault(email = 'demo@local') {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = await this.userModel.create({
        email,
        name: 'Demo User',
        provider: 'local',
        providerId: 'demo',
        theme: 'dark',
      });
    }
    return user;
  }

  async getUser(userId: string) {
    return this.userModel.findById(userId);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async updatePreferences(
    userId: string,
    payload: Partial<Pick<User, 'name' | 'theme'>>,
  ) {
    return this.userModel.findByIdAndUpdate(userId, payload, {
      returnDocument: 'after',
    });
  }

  async saveStopwatch(userId: string, elapsedMs: number, laps: number[]) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { lastStopwatch: { elapsedMs, laps, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
  }

  async findOrCreateOauth(payload: {
    provider: string;
    providerId: string;
    email: string;
    name: string;
  }) {
    let user = await this.userModel.findOne({
      provider: payload.provider,
      providerId: payload.providerId,
    });
    if (!user) {
      user = await this.userModel.create({
        name: payload.name,
        email: payload.email,
        provider: payload.provider,
        providerId: payload.providerId,
        avatarColor: '#60a5fa',
        theme: 'dark',
      });
    }
    return user;
  }

  async setRole(userId: string, role: 'admin' | 'user') {
    return this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { returnDocument: 'after' },
    );
  }
}
