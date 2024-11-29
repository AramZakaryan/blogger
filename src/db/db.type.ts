export type Db = {
  blogs: Blog[]
  posts: Post[]
}

export type Blog = {
  id: string
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
}

export type Post = {
  id: string
  title: string // maxLength: 30
  shortDescription: string // maxLength: 100
  content: string  // maxLength: 1000
  blogId: string
  blogName: string
}
