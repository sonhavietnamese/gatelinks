import { v4 as uuidv4 } from 'uuid'

export const randomID = () => uuidv4().slice(0, 8)
