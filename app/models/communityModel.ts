export interface User {
    id: any;
    username: any;
    email: any;
    groups: any;
}
export interface Group{
    id: any;
    name: any;
}
export interface Forum{
    id: any;
    title: any;
    description: any;
}
export interface Topic{
    id: any;
    title: any;
    description: any;
    created_at: any;
    forum: any;
}
export interface Post{
    id: any;
    content: any;
    created_at: any;
    author: any;
    topic: any;
    username: any;
}
export interface Comment{
    id: any;
    content: any;
    created_at: any;
    author: any;
    post: any;
    username: any;
}

export interface PostListResponse{
    count: any;
    next: any;
    previous: any;
    results: Post[];
}