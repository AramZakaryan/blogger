import { agent } from 'supertest';
import { app } from '../src/app';

export const superRequest = agent(app);