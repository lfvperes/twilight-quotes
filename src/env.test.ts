import * as dotenv from 'dotenv'; // Import dotenv
dotenv.config();
import { randomQuote } from './getRndQuote'

describe('Environment Variables', () => {
  it('should have BLUESKY_USERNAME defined', () => {
    expect(process.env.BLUESKY_USERNAME).toBeDefined();
  });

  it('should have BLUESKY_PASSWORD defined', () => {
    expect(process.env.BLUESKY_PASSWORD).toBeDefined();
  });
});

console.log(randomQuote());