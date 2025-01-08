import axios from 'axios';
import { ApiResponse } from '../Model/FeedItem'

const API_BASE_URL = 'https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1';

export const fetchFeedData = async (token: string, page: number = 1): Promise<ApiResponse | null> => {
    try {
        const response = await axios.get<ApiResponse>(
            `${API_BASE_URL}/memes?page=${page}&limit=20&prioritized=true&sort=popular`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error:any) {
        console.error("Error fetching feed data:", error.message);
        return null;
    }
};

export const likeMeme = async (token: string, meme_id: string) => {
    return axios.post(
        `${API_BASE_URL}/like`,
        { likeable_type: "like", resource_type: "meme", resource_id: meme_id },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const dislikeMeme = async (token: string, meme_id: string) => {
    return axios.post(
        `${API_BASE_URL}/like`,
        { likeable_type: "dislike", resource_type: "meme", resource_id: meme_id },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deleteLikeMeme = async (token: string, meme_id: string) => {
    return axios.delete(`${API_BASE_URL}/like`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { likeable_type: "like", resource_type: "meme", resource_id: meme_id },
    });
};

export const deleteDislikeMeme = async (token: string, meme_id: string) => {
    return axios.delete(`${API_BASE_URL}/like`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { likeable_type: "dislike", resource_type: "meme", resource_id: meme_id },
    });
};


