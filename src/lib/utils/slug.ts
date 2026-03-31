import { customAlphabet } from 'nanoid';

export const SLUG_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const SLUG_LENGTH = 7;

const nanoid = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH);

export const generateSlug = (): string => nanoid();
