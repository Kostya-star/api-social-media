import { validateEmail } from './validate-email';
import { checkFor400Error } from '../check-for-400-error';

export const validateUserEmailMdlwr = [validateEmail(), checkFor400Error];
