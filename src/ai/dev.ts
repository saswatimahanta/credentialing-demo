import { config } from 'dotenv';
config();

import '@/ai/flows/application-issue-detection.ts';
import '@/ai/flows/application-data-summarization.ts';
import '@/ai/flows/smart-auto-email-generation.ts';
import '@/ai/flows/generate-approve-modify-reject-suggestions.ts';