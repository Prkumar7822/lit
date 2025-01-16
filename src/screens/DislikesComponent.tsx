import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { dislikeMeme, deleteDislikeMeme } from '../services/ApiService';
import { dislikeComment, deleteDislikeComment } from '../services/ApiService';
import { DislikeComponentProps } from '../Model/interfaces';
import { styles } from '../component/styles';
import { FeedItem,Comment } from '../Model/interfaces';

const DislikeComponent: React.FC<DislikeComponentProps> = ({ meme_id, comment_id, onDislike }) => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [parentComments, setParentComments] = useState<Comment[]>([]);
    const [childComments, setChildComments] = useState<Comment[] | null>(null);

    const getCurrentItemIndex = () => {
        return feedData.findIndex(item =>
            (meme_id && item.meme_id === meme_id) ||
            (comment_id && item.comments.some(comment => comment.comment_id === comment_id))
        );
    };

    const isDisliked = getCurrentItemIndex() !== -1
        ? feedData[getCurrentItemIndex()].disliked_by_current_user
        : false;

    const updateDislikeStatus = (disliked: boolean) => {
        const index = getCurrentItemIndex();
        if (index !== -1) {
            const updatedFeedData = [...feedData];
            updatedFeedData[index] = {
                ...updatedFeedData[index],
                disliked_by_current_user: disliked,
                liked_by_current_user: disliked ? false : updatedFeedData[index].liked_by_current_user,
            };
            setFeedData(updatedFeedData);
        }
    };

    const handleDislike = async () => {
        const index = getCurrentItemIndex();
        if (index === -1) return;

        const meme_id = feedData[index].meme_id;
        const isDisliked = feedData[index].disliked_by_current_user;

        try {
            if (isDisliked) {
                await deleteDislikeMeme(meme_id);
            } else {
                await dislikeMeme(meme_id);
            }
            updateDislikeStatus(!isDisliked);
        } catch (error: any) {
            console.error("Error handling dislike:", error.message);
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

    return (
        <TouchableOpacity
            onPress={() => {
                if (meme_id) handleDislike();
                if (comment_id) handleDislikeComment(comment_id);
            }}
            style={styles.iconCircle}
        >
            <Image
                source={
                    isDisliked
                        ? require("../assests/images/dislikeh.png")
                        : require("../assests/images/dislike.png")
                }
                style={styles.dislikeIcon}
            />
        </TouchableOpacity>
    );
};

export default DislikeComponent;
