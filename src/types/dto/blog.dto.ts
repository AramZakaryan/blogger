import { BlogType } from '../blog.type'

export type BlogDto = Omit<BlogType, 'id'>
