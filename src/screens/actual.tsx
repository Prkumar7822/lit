import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    TextInput,
    Share,
    ListRenderItem,
    ActivityIndicator,
    ViewToken,
    Modal,
    Button,
    TouchableWithoutFeedback
} from "react-native";
import { Dimensions } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Video from 'react-native-video'; // Import video player component
import { StackParamList } from "../../App";
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get("window").height;

type NavigationProp = StackNavigationProp<StackParamList, "Home">;

interface FeedItem {
    meme_id: string;
    meme_title: string;
    image_url: string;
    description: string;
    comments: Comment[];
    isPlaying?: boolean; // Add this property
    liked_by_current_user: boolean,
    disliked_by_current_user: boolean
}

interface Comment {
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

interface ApiResponse {
    data: FeedItem[];
    message: string;
    status: string;
    statusCode: number;
}

const App: React.FC = () => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [currentComment, setCurrentComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsList, setCommentsList] = useState<string[]>([]);
    const [commentMemeId, setCommentMemeId] = useState<string | null>(null); // Track the meme ID for which the comment box is shown
    const flatListRef = useRef<FlatList>(null);
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
    const [swipeCount, setSwipeCount] = useState<number>(0);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [remainingSwipes, setRemainingSwipes] = useState<number>(3);
    const [likedMemes, setLikedMemes] = useState<Set<string>>(new Set());
    const [dislikedMemes, setDislikedMemes] = useState<Set<string>>(new Set());
    const [parentComments, setParentComments] = useState<Comment[]>([]);
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null); // Track the comment ID being replied to
    const [replyText, setReplyText] = useState<string>("");



    const navigation = useNavigation<NavigationProp>();

    const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IldsZFhxUFZFZndGbGJrQU4iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2l4bmJmdnllbmlrc2JxY2ZkbWRvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZmYwMjg4NC0xZWRjLTRkMzYtYWYyNC1iMWQ0YjI1ZDBkNDgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3MDk5NDE2LCJpYXQiOjE3MzY0OTQ2MTYsImVtYWlsIjoiIiwicGhvbmUiOiI5MTYzMDA4NDU0NDYiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJwaG9uZSIsInByb3ZpZGVycyI6WyJwaG9uZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiOWZmMDI4ODQtMWVkYy00ZDM2LWFmMjQtYjFkNGIyNWQwZDQ4In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzM2NDk0NjE2fV0sInNlc3Npb25faWQiOiIyYjdkMjhhZC05OTc0LTQwMjItYTUyZS05YzkyOTZkNmFjZTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.iqHPqF8XFyuBKXsxQaKlwBqSiS7ymKGWl09ZsGgimeE'; // Replace with your actual JWT token


    // Fetch feed data from API
    const fetchFeedData = async () => {
        if (loading) return; // Prevent multiple simultaneous requests
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/memes?page=1&limit=20&prioritized=true&sort=popular`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log("Fetched data:", response.data.data);
            const Data = response.data.data;
            // console.log("Fetched data:", data);
            if (Array.isArray(Data)) {
                setFeedData((prevData) => [...prevData, ...Data]);
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error("Error response:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error("Error request:", error.request);
            } else {
                // Something else happened while setting up the request
                console.error("Error message:", error.message);
            }
            console.error("Error fetching feed data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedData();
    }, [page]);



    useEffect(() => {
        const fetchStoredSwipes = async () => {
            try {
                const storedSwipes = await AsyncStorage.getItem("remainingSwipes");
                if (storedSwipes !== null) {
                    setRemainingSwipes(parseInt(storedSwipes, 10));
                } else {
                    setRemainingSwipes(5);
                }
            } catch (error) {
                console.error("Error fetching stored swipes:", error);
            }
        };
        fetchStoredSwipes();
    }, []);

    useEffect(() => {
        const saveSwipes = async () => {
            try {
                await AsyncStorage.setItem("remainingSwipes", remainingSwipes.toString());
            } catch (error) {
                console.error("Error saving swipes:", error);
            }
        };
        saveSwipes();
    }, [remainingSwipes]);

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
        if (viewableItems.length > 0) {
            const visibleItemIndex = viewableItems[0].index;
            setCurrentPlayingIndex(visibleItemIndex);
            setSwipeCount((prevCount) => prevCount + 1);
            if (remainingSwipes > 0) {
                setRemainingSwipes((prevSwipes) => prevSwipes - 1);
            }
            if (remainingSwipes <= 1) { // Show modal when remaining swipes reach 0
                setShowLoginModal(true);
            }
        }
    };



    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };


    const likeMeme = async (meme_id: string) => {
        try {
            const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                likeable_type: "like",
                resource_type: "meme",
                resource_id: meme_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Liked meme:", response.data);
        } catch (error: any) {
            console.error("Error liking meme:", error.message);
            // Revert the local state update if the API call fails

        }
    };


    const deleteLikeMeme = async (meme_id: string) => {
        try {
            const response = await axios.delete(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    likeable_type: "like",
                    resource_type: "meme",
                    resource_id: meme_id
                }
            });
            console.log("Deleted like:", response.data);
            // setFeedData((prevData) =>
            //     prevData.map((item) =>
            //         item.meme_id === meme_id ? { ...item, liked_by_current_user: false } : item
            //     )
            // );S
        } catch (error: any) {
            console.error("Error deleting like:", error.message);
        }
    };

    const handleLike = async (index: number) => {
        const meme_id = feedData[index].meme_id;
        const isLiked = feedData[index].liked_by_current_user;
        const isDisliked = feedData[index].disliked_by_current_user;
        console.log("isLiked", isLiked);
        console.log("isDisliked", isDisliked);

        try {
            if (isLiked) {
                await deleteLikeMeme(meme_id);
            } else {
                await likeMeme(meme_id);
                // if (isDisliked) {
                //     await deleteDislikeMeme(meme_id);
                // }
            }
            // Update the state to reflect the changes
            setFeedData((prevData) =>
                prevData.map((item, idx) =>
                    idx === index
                        ? {
                            ...item,
                            liked_by_current_user: !isLiked,
                            disliked_by_current_user: isLiked ? isDisliked : false,
                        }
                        : item
                )
            );
        } catch (error: any) {
            console.error("Error handling like:", error.message);
        }
    };

    const dislikeMeme = async (meme_id: string) => {
        try {
            const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                likeable_type: "dislike",
                resource_type: "meme",
                resource_id: meme_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Disliked meme:", response.data);
        } catch (error: any) {
            console.error("Error disliking meme:", error.message);
        }
    };

    const deleteDislikeMeme = async (meme_id: string) => {
        try {
            const response = await axios.delete(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    likeable_type: "dislike",
                    resource_type: "meme",
                    resource_id: meme_id
                }
            });
            console.log("Deleted dislike:", response.data);
            // setFeedData((prevData) =>
            //     prevData.map((item) =>
            //         item.meme_id === meme_id ? { ...item, disliked_by_current_user: false } : item
            //     )
            // );
        } catch (error: any) {
            console.error("Error deleting dislike:", error.message);
        }
    };

    const handleDislike = async (index: number) => {
        const meme_id = feedData[index].meme_id;
        const isLiked = feedData[index].liked_by_current_user;
        const isDisliked = feedData[index].disliked_by_current_user;

        try {
            if (isDisliked) {
                await deleteDislikeMeme(meme_id);
            } else {
                await dislikeMeme(meme_id);
                // if (isLiked) {
                //     await deleteLikeMeme(meme_id);
                // }
            }
            setFeedData((prevData) =>
                prevData.map((item, idx) =>
                    idx === index
                        ? {
                            ...item,
                            disliked_by_current_user: !isDisliked,
                            liked_by_current_user: isDisliked ? isLiked : false,
                        }
                        : item
                )
            );
        } catch (error: any) {
            console.error("Error handling dislike:", error.message);
        }
    };

    const likeComment = async (comment_id: string) => {
        try {
            const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                likeable_type: "like",
                resource_type: "comment",
                resource_id: comment_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Liked comment:", response.data);
            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === comment_id ? { ...comment, isLiked: true, isDisliked: false } : comment
                )
            );
        } catch (error: any) {
            console.error("Error liking comment:", error.message);
        }
    };

    const deleteLikeComment = async (comment_id: string) => {
        try {
            const response = await axios.delete(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                data: {
                    likeable_type: "like",
                    resource_type: "comment",
                    resource_id: comment_id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Deleted like on comment:", response.data);
            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === comment_id ? { ...comment, isLiked: false } : comment
                )
            );
        } catch (error: any) {
            console.error("Error deleting like on comment:", error.message);
        }
    };

    const dislikeComment = async (comment_id: string) => {
        try {
            const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                likeable_type: "dislike",
                resource_type: "comment",
                resource_id: comment_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Disliked comment:", response.data);
            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === comment_id ? { ...comment, isDisliked: true, isLiked: false } : comment
                )
            );
        } catch (error: any) {
            console.error("Error disliking comment:", error.message);
        }
    };

    const deleteDislikeComment = async (comment_id: string) => {
        try {
            const response = await axios.delete(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`, {
                data: {
                    likeable_type: "dislike",
                    resource_type: "comment",
                    resource_id: comment_id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Deleted dislike on comment:", response.data);
            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === comment_id ? { ...comment, isDisliked: false } : comment
                )
            );
        } catch (error: any) {
            console.error("Error deleting dislike on comment:", error.message);
        }
    };




    const handleLikeComment = async (comment_id: string) => {
        // Check if it's a child comment
        const parentCommentIndex = parentComments.findIndex(parent =>
            parent.childComments?.some(child => child.comment_id === comment_id)
        );

        if (parentCommentIndex !== -1) {
            const parentComment = parentComments[parentCommentIndex];
            const childComments = parentComment.childComments || [];
            const childCommentIndex = childComments.findIndex(child => child.comment_id === comment_id);

            if (childCommentIndex !== -1) {
                const isLiked = childComments[childCommentIndex].isLiked;
                const isDisliked = childComments[childCommentIndex].isDisliked;

                try {
                    if (isLiked) {
                        await deleteLikeComment(comment_id);
                    } else {
                        await likeComment(comment_id);
                        // if (isDisliked) {
                        //     await deleteDislikeComment(comment_id); // Remove dislike if it exists
                        // }
                    }

                    const updatedChildComments = [...childComments];
                    updatedChildComments[childCommentIndex] = {
                        ...updatedChildComments[childCommentIndex],
                        isLiked: !isLiked,
                        isDisliked: isLiked ? isDisliked : false, // Remove dislike if liked
                    };

                    const updatedParentComments = [...parentComments];
                    updatedParentComments[parentCommentIndex] = {
                        ...parentComment,
                        childComments: updatedChildComments,
                    };

                    setParentComments(updatedParentComments);
                } catch (error: any) {
                    console.error("Error handling like on child comment:", error.message);
                }
            }
        } else {
            // Handle parent comment like toggle
            const commentIndex = parentComments.findIndex(comment => comment.comment_id === comment_id);
            if (commentIndex !== -1) {
                const isLiked = parentComments[commentIndex].isLiked;
                const isDisliked = parentComments[commentIndex].isDisliked;

                try {
                    if (isLiked) {
                        await deleteLikeComment(comment_id);
                    } else {
                        await likeComment(comment_id);
                        // if (isDisliked) {
                        //     await deleteDislikeComment(comment_id); // Remove dislike if it exists
                        // }
                    }

                    const updatedParentComments = [...parentComments];
                    updatedParentComments[commentIndex] = {
                        ...updatedParentComments[commentIndex],
                        isLiked: !isLiked,
                        isDisliked: isLiked ? isDisliked : false, // Remove dislike if liked
                    };

                    setParentComments(updatedParentComments);
                } catch (error: any) {
                    console.error("Error handling like on parent comment:", error.message);
                }
            }
        }
    };


    const handleDislikeComment = async (comment_id: string) => {
        const parentCommentIndex = parentComments.findIndex(parent =>
            parent.childComments?.some(child => child.comment_id === comment_id)
        );

        if (parentCommentIndex !== -1) {
            const parentComment = parentComments[parentCommentIndex];
            const childComments = parentComment.childComments || [];
            const childCommentIndex = childComments.findIndex(child => child.comment_id === comment_id);

            if (childCommentIndex !== -1) {
                const isLiked = childComments[childCommentIndex].isLiked;
                const isDisliked = childComments[childCommentIndex].isDisliked;

                try {
                    if (isDisliked) {
                        await deleteDislikeComment(comment_id);
                    } else {
                        await dislikeComment(comment_id);
                        // if (isLiked) {
                        //     await deleteLikeComment(comment_id); // Remove like if it exists
                        // }
                    }

                    const updatedChildComments = [...childComments];
                    updatedChildComments[childCommentIndex] = {
                        ...updatedChildComments[childCommentIndex],
                        isDisliked: !isDisliked,
                        isLiked: isDisliked ? isLiked : false, // Remove like if disliked
                    };

                    const updatedParentComments = [...parentComments];
                    updatedParentComments[parentCommentIndex] = {
                        ...parentComment,
                        childComments: updatedChildComments,
                    };

                    setParentComments(updatedParentComments);
                } catch (error: any) {
                    console.error("Error handling dislike on child comment:", error.message);
                }
            }
        } else {
            const commentIndex = parentComments.findIndex(comment => comment.comment_id === comment_id);
            if (commentIndex !== -1) {
                const isLiked = parentComments[commentIndex].isLiked;
                const isDisliked = parentComments[commentIndex].isDisliked;

                try {
                    if (isDisliked) {
                        await deleteDislikeComment(comment_id);
                    } else {
                        await dislikeComment(comment_id);
                        // if (isLiked) {
                        //     await deleteLikeComment(comment_id); // Remove like if it exists
                        // }
                    }

                    const updatedParentComments = [...parentComments];
                    updatedParentComments[commentIndex] = {
                        ...updatedParentComments[commentIndex],
                        isDisliked: !isDisliked,
                        isLiked: isDisliked ? isLiked : false, // Remove like if disliked
                    };

                    setParentComments(updatedParentComments);
                } catch (error: any) {
                    console.error("Error handling dislike on parent comment:", error.message);
                }
            }
        }
    };

    const handleCommentIconPress = async (meme_id: string) => {
        if (commentMemeId === meme_id) {
            setShowCommentBox(!showCommentBox); // Toggle the comment box visibility
        } else {
            setCommentMemeId(meme_id);
            setShowCommentBox(true);

            try {
                const response = await axios.get(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`, {
                    params: {
                        meme_id: meme_id,
                        page: 1,
                        limit: 10,
                        sort: 'recent'
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Parent comments fetched successfully:", response.data.data);
                // Update state with fetched comments
                setParentComments(response.data.data);
            } catch (error: any) {
                console.error("Error fetching parent comments:", error.message);
            }
        }
    };

    const handleCommentSubmit = async () => {
        if (comment.trim().length > 0 && commentMemeId) {
            try {
                const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`, {
                    meme_id: commentMemeId,
                    comment: comment.trim(),
                    parent_comment_id: null // Assuming it's a parent comment
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Comment added successfully:", response.data.data);

                // Update state with the new comment
                setParentComments((prevComments) => [...prevComments, response.data.data[0]]);
                setComment("");
                setShowCommentBox(false);
                setCommentMemeId(null);
            } catch (error: any) {
                console.error("Error adding comment:", error.message);
            }
        }
    };


    const handleReplySubmit = async () => {
        if (!replyingToCommentId) return;

        try {
            const response = await axios.post(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`, {
                meme_id: commentMemeId,
                parent_comment_id: replyingToCommentId,
                comment: replyText,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Reply added successfully:", response.data.data);

            // Update state with the new reply
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === replyingToCommentId
                        ? { ...comment, reply_count: comment.reply_count + 1 }
                        : comment
                )
            );
            setReplyText("");
            setReplyingToCommentId(null);
        } catch (error: any) {
            console.error("Error adding reply:", error.message);
        }
    };

    const fetchChildComments = async (parent_comment_id: string) => {
        try {
            const response = await axios.get(`https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`, {
                params: {
                    meme_id: commentMemeId,
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
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === parent_comment_id
                        ? { ...comment, childComments: response.data.data }
                        : comment
                )
            );
        } catch (error: any) {
            console.error("Error fetching child comments:", error.message);
            return [];
        }
    };

    const handleShare = async (memeId: string, imageUrl: string) => {
        const url = `https://myapp.com/meme/${memeId}`;
        try {
            const result = await Share.share({
                message: `Check out this meme: ${url}`,
                url: imageUrl,  // Pass the image URL here
            });
            
            if (result.action === Share.sharedAction) {
                console.log("Shared successfully!");
            } else if (result.action === Share.dismissedAction) {
                console.log("Share dismissed.");
            }
        } catch (error) {
            console.error("Error sharing content:", error);
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
        setSwipeCount(0); // Reset swipe count
        if (flatListRef.current && currentPlayingIndex !== null) {
            flatListRef.current.scrollToIndex({ index: currentPlayingIndex - 1, animated: true });
        }
    };


    const renderChildComments = (childComments: Comment[]) => {
        return childComments.map((childComment) => (
            <View key={childComment.comment_id} style={styles.childCommentContainer}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: childComment.User.profile_picture_url || 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.commentUsername}>{childComment.User.username}</Text>
                </View>
                <Text style={styles.commentText}>{childComment.comment}</Text>
                <View style={styles.likeDislikeContainer}>
                    <TouchableOpacity onPress={() => handleLikeComment(childComment.comment_id)} style={styles.likeButton}>
                        <Image
                            source={childComment.isLiked ? require("../assests/images/likeh.png") : require("../assests/images/like.png")}
                            style={styles.likeIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDislikeComment(childComment.comment_id)} style={styles.dislikeButton}>
                        <Image
                            source={childComment.isDisliked ? require("../assests/images/dislikeh.png") : require("../assests/images/dislike.png")}
                            style={styles.dislikeIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        ));
    };

    const baseUrl = "https://ixnbfvyeniksbqcfdmdo.supabase.co/storage/v1/object/public/";

    // Helper function to determine if the file is a video
    const isVideo = (url: string | null) => {
        if (!url) return false;
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
        return videoExtensions.some((ext) => url.endsWith(ext));
    };

    const renderItem: ListRenderItem<FeedItem> = ({ item, index }) => {
        const fileUrl = item.image_url ? `${baseUrl}${item.image_url}` : undefined
        const isFileVideo = fileUrl && isVideo(fileUrl);
    
        return (
            <View style={styles.fullScreenContainer}>
                <View style={styles.titlecontainer}>
                    <Text numberOfLines={1} style={styles.title}>{item.meme_title}</Text>
                </View>
    
                <View style={styles.videocontainer}>
                    {isFileVideo ? (
                        <Video
                            source={{ uri: fileUrl }}
                            style={styles.mainImage}
                            controls={false}
                            resizeMode="cover"
                            repeat={true}
                            playInBackground={false}
                            paused={currentPlayingIndex !== index} // Ensure `currentPlayingIndex` is handled properly
                        />
                    ) : (
                        <Image source={{ uri: fileUrl }} style={styles.mainImage} />
                    )}
                </View>
    
                <View style={styles.desccontianer}>
                    <Text numberOfLines={3} style={styles.description}>{item.description}</Text>
                </View>
    
                <View style={styles.footerIcons}>
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleLike(index)}>
                            <Image
                                source={item.liked_by_current_user ? require("../assests/images/likeh.png") : require("../assests/images/like.png")}
                                style={styles.optionsIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleDislike(index)}>
                            <Image
                                source={item.disliked_by_current_user ? require("../assests/images/dislikeh.png") : require("../assests/images/dislike.png")}
                                style={styles.optionsIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => handleCommentIconPress(item.meme_id)}>
                        <View style={styles.iconCircle}>
                            <Image
                                source={require("../assests/images/Vector.png")}
                                style={styles.optionsIcon}
                            />
                        </View>
                    </TouchableOpacity>
    
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleShare(item.meme_id,item.image_url)}>
                            <Image
                                source={require("../assests/images/share.png")}
                                style={[styles.optionsIcon, { tintColor: "white" }]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const NavigationBar = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                <Image
                    source={require("../assests/images/option.png")}
                    style={[styles.icon, { tintColor: 'white' }]}
                />
            </TouchableOpacity>

            <View style={styles.head}>
                <Image source={require("../assests/images/Group.png")} />
                <Text style={styles.headerText}>Litz Chill</Text>
            </View>
            <TouchableOpacity>
                <Image source={require("../assests/images/Lighting.png")} style={styles.lightningIcon} />
            </TouchableOpacity>
        </View>
    );

    const handleEndReached = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <View style={styles.container}>
            <NavigationBar />
            <FlatList
                ref={flatListRef}
                data={feedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.meme_id}-${index}`}
                snapToAlignment="start"
                snapToInterval={screenHeight}
                decelerationRate="fast"
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onEndReached={() => setPage((prevPage) => prevPage + 1)}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                contentContainerStyle={{ paddingBottom: 80 }}

            />
            <Modal
                transparent={true}
                visible={showLoginModal}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.loginModalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowLoginModal(false)}>
                            <Image source={require("../assests/images/cross.png")} style={styles.closeIcon} />
                        </TouchableOpacity>
                        <Image source={require("../assests/images/lock.png")} />
                        <Text style={styles.modalText}>Unlock Full Access!</Text>
                        <Text style={styles.modalText}>Log in to access meme feeds, comment, share, view flash news, and much more.</Text>
                        <Text style={styles.abovelogin}>You’re one step away!.</Text>
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginPage')}>
                            <Text style={styles.loginButtontext}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showCommentBox}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCommentBox(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowCommentBox(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <View style={{ height: screenHeight / 2 }}>

                        <FlatList
                            data={parentComments}
                            renderItem={({ item }) => (
                                <View key={item.comment_id} style={styles.commentContainer}>
                                    <View style={styles.profileContainer}>
                                        <Image
                                            source={{ uri: item.User.profile_picture_url || 'https://via.placeholder.com/150' }}
                                            style={styles.profileImage}
                                        />
                                        <Text style={styles.commentUsername}>{item.User.username}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.commentText}>{item.comment}</Text>
                                    </View>
                                    <View style={styles.likeDislikeContainer}>
                                        <TouchableOpacity onPress={() => handleLikeComment(item.comment_id)} style={styles.likeButton}>
                                            <Image
                                                source={item.isLiked ? require("../assests/images/likeh.png") : require("../assests/images/like.png")}
                                                style={styles.likeIcon}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDislikeComment(item.comment_id)} style={styles.dislikeButton}>
                                            <Image
                                                source={item.isDisliked ? require("../assests/images/dislikeh.png") : require("../assests/images/dislike.png")}
                                                style={styles.dislikeIcon}
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setReplyingToCommentId(item.comment_id);
                                                setReplyText(""); // Optional: clear any previous reply text
                                                setComment("");
                                            }}
                                        >
                                            <View style={styles.replyContainer}>
                                                <Image
                                                    source={require('../assests/images/reply.png')}
                                                    style={styles.optionsIcon}
                                                />
                                                <Text style={styles.replyText}>Reply</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {item.reply_count > 0 && (
                                        <TouchableOpacity
                                            onPress={async () => {
                                                const childComments = await fetchChildComments(item.comment_id);
                                                setParentComments((prevComments) =>
                                                    prevComments.map((comment) =>
                                                        comment.comment_id === item.comment_id
                                                            ? { ...comment, childComments }
                                                            : comment
                                                    )
                                                );
                                            }}
                                        >
                                            <View style={styles.viewRepliesContainer}>
                                                <Text style={styles.viewRepliesText}>{item.reply_count}</Text>
                                                <Text style={styles.viewRepliesText}>Replies</Text>
                                                <Image
                                                    source={require('../assests/images/downarrow.png')}
                                                    style={styles.optionsIcon}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    {item.childComments && renderChildComments(item.childComments)}
                                </View>
                            )}
                            keyExtractor={(item) => item.comment_id}
                        />
                        {/* Unified Input Box */}
                        <View style={styles.commentBox}>
                            <TextInput
                                style={styles.commentInput}
                                value={replyingToCommentId ? replyText : comment}
                                onChangeText={(text) => (replyingToCommentId ? setReplyText(text) : setComment(text))}
                                placeholder={
                                    replyingToCommentId
                                        ? 'Write your reply...'
                                        : 'Type your comment...'
                                }
                                placeholderTextColor="gray"
                            />
                            <TouchableOpacity
                                onPress={replyingToCommentId ? handleReplySubmit : handleCommentSubmit}
                            >
                                <Image
                                    source={require('../assests/images/send.png')}
                                    style={styles.optionsIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        height: screenHeight, // Ensure it occupies the full screen
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#101114",
        flex: 1,
        borderRadius: 30,
    },
    titlecontainer: { height: 100, width: '100%', },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        // Align text to the left
        alignSelf: "flex-start", // Ensure it aligns to the start of the container
        paddingHorizontal: 10, // Add padding for readability
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    videocontainer: {
        height: 400,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: "90%",
        height: screenHeight * 0.4, // Adjust height to fit content proportionally
        borderRadius: 8,
        marginVertical: 16,
        alignSelf: "center",
    },
    desccontianer: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: "gray",
        textAlign: "left",
        alignSelf: "flex-start",
        paddingHorizontal: 10, // Add padding for readability
    },
    footerIcons: {
        flexDirection: "row",
        // justifyContent: "space-evenly",
        width: "100%",
        paddingHorizontal: 10,
        position: "absolute",
        bottom: 150,
        justifyContent: 'center',
    },
    optionsIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomColor: "#ddd",
        backgroundColor: "black",
        marginBottom: 20,
    },
    headerText: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
    },
    lightningIcon: {
        color: "#f1c40f",
        width: 30,
        height: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        width: "100%",
        padding: 20,
        backgroundColor: "#1c1c1e", // Dark theme consistency
        borderRadius: 16,
        // alignItems: "center",
        marginBottom: 20, // Add spacing from the bottom
    },
    modalText: {
        fontSize: 18,
        color: "white", // Match theme
        textAlign: "center",
        marginBottom: 12,
    },
    loginModalContent: {
        backgroundColor: '#1c1c1e',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        margin: 20,
    },
    loginModalText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
    },
    loginButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        width: '100%', // Make the button span the full width
        textAlign: 'center',
    },
    loginButtontext: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeIcon: {
        width: 18,
        height: 18,
    },
    abovelogin: {
        justifyContent: "center",
        alignContent: "center",
        color: "white",
        fontSize: 20,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#1c2020',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    commentBox: {
        flexDirection: 'row',
        marginTop: 16,
        backgroundColor: '#1c1c1e',
        borderRadius: 8,
    },
    commentInput: {
        flex: 1,
        color: 'white',
        padding: 8,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 8,
    },
    commentSection: {
        width: '100%',
        padding: 16,
        backgroundColor: '#1c1c1e',
        borderRadius: 8,
        marginTop: 16,
    },
    commentContainer: {
        marginBottom: 16,
        flexDirection: 'column', // Ensure column layout
    },
    commentUsername: {
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 6,
    },
    commentText: {
        color: 'white',
        marginBottom: 8,
        marginLeft: 50,
    },
    icon: {
        height: 24,
        width: 24,
        marginLeft: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    likeButton: {
        marginLeft: 8,
    },
    likeIcon: {
        width: 20,
        height: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
    },
    likeDislikeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 50,
        marginTop: 8,
    },
    dislikeButton: {
        marginRight: 16,
        marginLeft: 8,
        marginTop: 1,
    },
    dislikeIcon: {
        width: 20,
        height: 20,
        marginLeft: 8,
    },
    viewRepliesText: {
        color: 'white',
        marginTop: 8,
    },
    childCommentContainer: {
        marginLeft: 40,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: 'column', // Ensure column layout for child comments
    },
    replyText: {
        color: '#007BFF',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        marginLeft: 10,
    },
    replyBox: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    replyInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    replyContainer: {
        flexDirection: 'row',
    },
    viewRepliesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 50,
    }
});

export default App;


