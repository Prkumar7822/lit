import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { likeMeme, deleteLikeMeme } from '../services/ApiService';
import { likeComment, deleteLikeComment } from '../services/ApiService';
import { styles } from '../component/styles';
import { LikeComponentProps } from '../Model/interfaces';
import { FeedItem, Comment } from '../Model/interfaces';

const LikeComponent: React.FC<LikeComponentProps> = ({ meme_id, comment_id }) => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [parentComments, setParentComments] = useState<Comment[]>([]);

    // Function to check if the meme or comment is liked
    const isLiked = (meme_id: string | undefined | null, comment_id: string | undefined | null) => {
        if (meme_id) {
            // Check if meme is liked
            const meme = feedData.find(item => item.meme_id === meme_id);
            return meme ? meme.liked_by_current_user :;
        }
        if (comment_id) {
            // Check if comment is liked
            const parentComment = parentComments.find(comment => comment.comment_id === comment_id);
            return parentComment ? parentComment.isLiked : false;
        }
        return false;
    };

    // Function to update the like status of a meme
    const handleLikeMeme = async () => {
        if (!meme_id) return; // Return early if meme_id is not provided

        const meme = feedData.find(item => item.meme_id === meme_id);
        const currentLikedStatus = meme ? meme.liked_by_current_user : false;

        try {
            if (currentLikedStatus) {
                await deleteLikeMeme(meme_id);
                console.log('Deleted like for meme:', meme_id);
            } else {
                await likeMeme(meme_id);
                console.log('Liked meme:', meme_id);
            }

            // Update the feedData to toggle the like status
            setFeedData(prevData =>
                prevData.map(item =>
                    item.meme_id === meme_id
                        ? { ...item, liked_by_current_user: !currentLikedStatus }
                        : item
                )
            );
        } catch (error: any) {
            console.error("Error handling like:", error.message);
        }
    };

    // Function to update the like status of a comment
    const handleLikeComment = async (comment_id: string | null) => {
        if (!comment_id) return; // Return early if comment_id is not provided

        const comment = parentComments.find(c => c.comment_id === comment_id);
        if (!comment) return;

        const currentLikedStatus = comment.isLiked;

        try {
            if (currentLikedStatus) {
                await deleteLikeComment(comment_id);
                console.log('Deleted like for comment:', comment_id);
            } else {
                await likeComment(comment_id);
                console.log('Liked comment:', comment_id);
            }

            // Update the parentComments to toggle the like status
            setParentComments(prevComments =>
                prevComments.map(c =>
                    c.comment_id === comment_id
                        ? { ...c, isLiked: !currentLikedStatus }
                        : c
                )
            );
        } catch (error: any) {
            console.error("Error handling like on comment:", error.message);
        }
    };

    useEffect(() => {
        // Assuming the feedData and parentComments are fetched somewhere
        // Ensure feedData and parentComments are loaded properly
    }, [feedData, parentComments]);

    return (
        <TouchableOpacity
            onPress={() => {
                if (meme_id) handleLikeMeme(); // Safely call handleLikeMeme if meme_id exists
                if (comment_id) handleLikeComment(comment_id); // Safely call handleLikeComment if comment_id exists
            }}
            style={styles.iconCircle}
        >
            <Image
                source={
                    isLiked(meme_id, comment_id)
                        ? require("../assests/images/likeh.png")
                        : require("../assests/images/like.png")
                }
                style={styles.likeIcon}
            />
        </TouchableOpacity>
    );
};

export default LikeComponent;
