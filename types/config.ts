export interface ConfigMapVO {
    [key: string]: ConfigVO
}

export interface  ConfigVO {
    Id: string;
    Type: string;   
    CreatedAt: string;
    UpdatedAt: string;
    Content: Content;
}

export interface Content {
    Title: string;
    Description: string;
    Avatar: string;
    Name: string;
    Bio: string;
    Github: string;
    Blog: string;
    Location: string;
    TechStacks: string[];
    Repositories: Repo[];
    Quote: string;
    Motto: string;
    ShowRecentPosts: boolean;
    RecentPostsCount: number;
    ShowRepositories: boolean;
    Skills: Skill[];
    Timeline: Timeline[];
    Interests: string[];
    FocusItems: string[];
    SEOTitle: string;
    SEOKeywords: string[];
    SEODescription: string;
    SEOAuthor: string;
    RobotsMeta: string;
    CanonicalURL: string;
    OGTitle: string;
    OGDescription: string;
    OGImage: string;
    TwitterCard: string;
}
export interface Repo {
    Name: string;
    URL: string;
    Desc: string;
}
export interface Skill {
    Category: string;
    Items: string[];
}
export interface Timeline {
    Year: string;
    Title: string;
    Desc: string;
}