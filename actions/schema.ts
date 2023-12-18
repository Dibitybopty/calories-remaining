import { z} from 'zod';

export const CreateSafeUser = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name is required'
    }).min(1, {
        message: 'Name is too short'
    }),
    image: z.string({
        required_error: 'Image is required',
        invalid_type_error: 'Image is required'
    }).min(1, {
        message: 'Image is too short'
    }),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email is required'
    }).min(1, {
        message: 'Email is too short'
    }),
});