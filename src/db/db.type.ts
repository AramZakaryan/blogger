export type Db = {
  blogs: Blog[]
  posts: any[]
}

export type Blog = {
  id: string
  name: string
  description: string
  websiteUrl: string
}
