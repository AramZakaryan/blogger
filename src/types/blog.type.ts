
export type BlogViewModel = BlogType & { id: string }

export type BlogType = {
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
  createdAt: Date
  isMembership: boolean
}
