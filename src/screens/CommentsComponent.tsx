import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import { styles } from '../component/styles';
import { Comment } from '../Model/interfaces';
import LikeComponent from '../screens/LikesComponent';
import { token } from '../services/ApiService';
import { Dimensions } from "react-native";
import { FeedItem } from '../Model/interfaces';
import DislikeComponent from './DislikesComponent';

interface CommentsComponentProps {
    meme_id: string | null;
    comments: Comment[] | undefined;
    onClose: () => void;
}

const CommentsComponent: React.FC<CommentsComponentProps> = ({ meme_id, comments = [], onClose }) => {
    const [comment, setComment] = useState('');
    const [parentComments, setParentComments] = useState<Comment[]>(comments);
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [commentMemeId, setCommentMemeId] = useState<string | null>(null); // Track the meme ID for which the comment box is shown
    const [showCommentBox, setShowCommentBox] = useState(false);
    const screenHeight = Dimensions.get("window").height;

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
        if (!meme_id || !comment.trim()) return;

        try {
            const response = await axios.post(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`,
                {
                    meme_id,
                    comment: comment.trim(),
                    parent_comment_id: null, // Parent comment
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setParentComments([...parentComments, response.data.data[0]]);
            setComment('');
        } catch (error: any) {
            console.error("Error adding comment:", error.message);
        }
    };

    const handleReplySubmit = async () => {
        if (!meme_id || !replyText.trim() || !replyingToCommentId) return;

        try {
            const response = await axios.post(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`,
                {
                    meme_id,
                    comment: replyText.trim(),
                    parent_comment_id: replyingToCommentId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedComments = parentComments.map(comment =>
                comment.comment_id === replyingToCommentId
                    ? {
                        ...comment,
                        reply_count: comment.reply_count + 1,
                        childComments: [...(comment.childComments || []), response.data.data[0]],
                    }
                    : comment
            );

            setParentComments(updatedComments);
            setReplyText('');
            setReplyingToCommentId(null);
        } catch (error: any) {
            console.error("Error adding reply:", error.message);
        }
    };

    const fetchChildComments = async (parentCommentId: string) => {
        try {
            const response = await axios.get(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/comment`,
                {
                    params: {
                        meme_id,
                        parent_id: parentCommentId,
                        page: 1,
                        limit: 10,
                        sort: 'recent',
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === parentCommentId
                        ? { ...comment, childComments: response.data.data }
                        : comment
                )
            );
        } catch (error: any) {
            console.error("Error fetching child comments:", error.message);
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

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentContainer} key={item.comment_id}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: item.User.profile_picture_url || 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
                <Text style={styles.commentUsername}>{item.User.username}</Text>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
            <View style={styles.likeDislikeContainer}>
                <LikeComponent
                    comment_id={item.comment_id}
                    meme_id={meme_id}
                    isLiked={item.isLiked || false}
                    feedData={feedData}
                    // onLike={() => handleLikeComment(item.comment_id)} // Add handler for like
                />
                <DislikeComponent
                    comment_id={item.comment_id}
                    meme_id={meme_id}
                    isDisliked={item.isDisliked || false}
                    onDislike={() => handleDislikeComment(item.comment_id)} // Add handler for dislike
                />
                <TouchableOpacity onPress={() => setReplyingToCommentId(item.comment_id)}>
                    <Text style={styles.replyText}>Reply</Text>
                </TouchableOpacity>
            </View>
            {item.reply_count > 0 && (
                <TouchableOpacity onPress={() => fetchChildComments(item.comment_id)}>
                    <Text style={styles.viewRepliesText}>{item.reply_count} Replies</Text>
                </TouchableOpacity>
            )}
            {item.childComments && (
                <FlatList
                    data={item.childComments}
                    renderItem={({ item }) => renderComment({ item })}
                    keyExtractor={(childItem) => childItem.comment_id}
                />
            )}
        </View>
    );

    const handleLikeComment = async (commentId: string) => {
        try {
            await axios.post(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/like`,
                { comment_id: commentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === commentId
                        ? { ...comment, isLiked: !comment.isLiked, like_count: comment.like_count + (comment.isLiked ? -1 : 1) }
                        : comment
                )
            );
        } catch (error: any) {
            console.error("Error liking comment:", error.message);
        }
    };

    const handleDislikeComment = async (commentId: string) => {
        try {
            await axios.post(
                `https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/dislike`,
                { comment_id: commentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setParentComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === commentId
                        ? { ...comment, isDisliked: !comment.isDisliked, dislike_count: + (comment.isDisliked ? -1 : 1) }
                        : comment
                )
            );
        } catch (error: any) {
            console.error("Error disliking comment:", error.message);
        }
    };

    return (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={() => meme_id && handleCommentIconPress(meme_id)}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
                <FlatList
                    data={parentComments}
                    renderItem={renderComment}
                    keyExtractor={(item) => item.comment_id}
                />
                <View style={styles.commentBox}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder={replyingToCommentId ? "Write your reply..." : "Type your comment..."}
                        value={replyingToCommentId ? replyText : comment}
                        onChangeText={(text) =>
                            replyingToCommentId ? setReplyText(text) : setComment(text)
                        }
                    />
                    <TouchableOpacity onPress={replyingToCommentId ? handleReplySubmit : handleCommentSubmit}>
                        <Image source={require('../assests/images/send.png')} style={styles.optionsIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CommentsComponent;
