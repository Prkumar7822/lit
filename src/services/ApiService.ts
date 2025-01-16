import axios from 'axios';


const API_URL = 'https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IldsZFhxUFZFZndGbGJrQU4iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2l4bmJmdnllbmlrc2JxY2ZkbWRvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZmYwMjg4NC0xZWRjLTRkMzYtYWYyNC1iMWQ0YjI1ZDBkNDgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3MDk5NDE2LCJpYXQiOjE3MzY0OTQ2MTYsImVtYWlsIjoiIiwicGhvbmUiOiI5MTYzMDA4NDU0NDYiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJwaG9uZSIsInByb3ZpZGVycyI6WyJwaG9uZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiOWZmMDI4ODQtMWVkYy00ZDM2LWFmMjQtYjFkNGIyNWQwZDQ4In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzM2NDk0NjE2fV0sInNlc3Npb25faWQiOiIyYjdkMjhhZC05OTc0LTQwMjItYTUyZS05YzkyOTZkNmFjZTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.iqHPqF8XFyuBKXsxQaKlwBqSiS7ymKGWl09ZsGgimeE'; // Replace with your actual JWT token

export const fetchFeedData = async () => {
    const response = await axios.get(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/memes?page=1&limit=20&prioritized=true&sort=popular`, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Enhanced error handling with logging and fixed dislike behavior
export const likeMeme = async (meme_id: string) => {
    try {
        const response = await axios.post(`${API_URL}/like`, {
            likeable_type: "like",
            resource_type: "meme",
            resource_id: meme_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Meme liked successfully:", response.data);
        return response.data;
    } catch (error) {
       // console.error("Error liking meme:", error.response?.data || error.message);
        throw error; // Rethrow the error to handle it in the caller
    }
};

export const dislikeMeme = async (meme_id: string) => {
    try {
        const response = await axios.post(`${API_URL}/like`, {
            likeable_type: "dislike",
            resource_type: "meme",
            resource_id: meme_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Meme disliked successfully:", response.data);
        return response.data;
    } catch (error) {
       // console.error("Error disliking meme:", error.response?.data || error.message);
        throw error; // Rethrow the error to handle it in the caller
    }
};

export const deleteLikeMeme = async (meme_id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/like`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                likeable_type: "like",       // Make sure this matches what the API expects for "like" deletion
                resource_type: "meme",       // Ensure this is correctly set to "meme"
                resource_id: meme_id        // The meme ID to delete the like for
            }
        });
        console.log("Like deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error deleting like on meme:", error.response?.data || error.message);
        throw error; // Rethrow the error for higher-level handling
    }
};


export const deleteDislikeMeme = async (meme_id:string) => {
    return axios.delete(`${API_URL}/like`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            likeable_type: "dislike",
            resource_type: "meme",
            resource_id: meme_id
        }
    });
};

export const likeComment = async (comment_id:string) => {
    return axios.post(`${API_URL}/like`, {
        likeable_type: "like",
        resource_type: "comment",
        resource_id: comment_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteLikeComment = async (comment_id:string) => {
    return axios.delete(`${API_URL}/like`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            likeable_type: "like",
            resource_type: "comment",
            resource_id: comment_id
        }
    });
};

export const dislikeComment = async (comment_id:string) => {
    return axios.post(`${API_URL}/like`, {
        likeable_type: "dislike",
        resource_type: "comment",
        resource_id: comment_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteDislikeComment = async (comment_id:string) => {
    return axios.delete(`${API_URL}/dislike`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            likeable_type: "dislike",
            resource_type: "comment",
            resource_id: comment_id
        }
    });
};

export const postComment = async (meme_id: string, comment: string) => {
    try {
        const response = await axios.post(`${API_URL}/comment`, {
            meme_id,
            comment
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to post comment');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};

export const fetchComments = async (meme_id: string) => {
    try {
        const response = await axios.get(`${API_URL}/comment`, { // Removed the extra `}`
            headers: {
                Authorization: `Bearer ${token}`, // Ensure `token` is correctly set
            },
            params: {
                meme_id: meme_id, // Query parameter for the meme ID
                page: 1,          // Page number
                limit: 10,        // Number of comments per page
                sort: 'recent',   // Sort order
            },
        });
        return response.data; // Return the fetched comments
    } catch (error:any) {
        console.error('Error fetching comments:', error.message);
        throw error; // Propagate the error for caller to handle
    }
};

export const fetchChildComments = async (meme_id: string, parent_comment_id: string) => {
    try {
        const response = await axios.get(`${API_URL}/comment`, {
            params: {
                meme_id,
                parent_id: parent_comment_id,
                page: 1,
                limit: 10,
                sort: 'recent'
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Child comments fetched successfully:", response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching child comments:", error.message);
        return [];
    }
};

// export const postReply = async (comment_id:string, reply:string) => {
//     return axios.post(`${API_URL}/reply`, {
//         comment_id,
//         reply
//     }, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
// };