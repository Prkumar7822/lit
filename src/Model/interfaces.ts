export interface User {
    profile_picture_url: string;
    username: string;
}


export interface Comment {
    comment_id: string;
    user_id: string;
    User: {
        username: string;
        profile_picture_url: string | null;
    };
    like_count: number;
    
    reply_count: number;
    meme_id: string;
    comment: string;
    parent_comment_id: string | null;
    isLiked: boolean;
    isDisliked: boolean;
    childComments?: Comment[]; // Add child comments

}



export interface FeedItem {
    meme_id: string;
    meme_title: string;
    image_url: string;
    liked_by_current_user: boolean;
    disliked_by_current_user: boolean;
    comments: Comment[];
    description: string;

}

export interface ApiResponse {
    data: FeedItem[];
    message: string;
    status: string;
    statusCode: number;
}


export interface LikeComponentProps {
    meme_id?: string |null; // Optional for comments
    comment_id?: string; // Optional for comments
    isLiked: boolean;
    feedData: FeedItem[];
    // onLike: () => void;
}

export interface DislikeComponentProps {
    meme_id?: string|null; // Optional for comments
    comment_id?: string; // Optional for comments
    isDisliked: boolean;
    onDislike: () => void;
}

export interface CommentComponentProps {
    meme_id: string;
    comments: Comment[];
    onCommentIconPress: () => void;
}