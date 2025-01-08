import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface CommentsProps {
    comment: string;
    setComment: (text: string) => void;
    handleCommentSubmit: () => void;
}

const Comments: React.FC<CommentsProps> = ({ comment, setComment, handleCommentSubmit }) => (
    <View style={styles.commentBox}>
        <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment..."
        />
        <Button title="Post" onPress={handleCommentSubmit} />
    </View>
);

const styles = StyleSheet.create({
    commentBox: {
        margin: 10,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        marginBottom: 5,
    },
});

export default Comments;
