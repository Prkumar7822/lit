export interface FeedItem {
    meme_id: string;
    meme_title: string;
    image_url: string;
    description: string;
    isLiked: boolean;
    isDisliked: boolean;
    comments: string[];
    isPlaying?: boolean;
}

export interface ApiResponse {
    data: FeedItem[];
    message: string;
    status: string;
    statusCode: number;
}
