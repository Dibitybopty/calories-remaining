import { z } from 'zod';
import { Users } from '@prisma/client';

import { ActionState } from '@/lib/create-safe-action';

import { CreateSafeUser } from './schema';

export type InputType = z.infer<typeof CreateSafeUser>;
export type ReturnType = ActionState<InputType, Users>;