import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Share,
    Animated,
    Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileScreen from "./Profile";
import { StackParamList } from '../../App'; // Import the param list
import { StackNavigationProp } from "@react-navigation/stack";

// Function to generate a unique URL using the title
const generateUrl = (title: any) => {
    const baseUrl = "https://myapp.com/feed"; // Replace with your app's domain
    const formattedTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    return `${baseUrl}/${formattedTitle}`;
};
type NavigationProp = StackNavigationProp<StackParamList, "Home">;


const App = () => {

    const navigation = useNavigation<NavigationProp>();



    const [isLiked, setIsLiked] = useState(false); // Like state
    const [isDisliked, setIsDisliked] = useState(false); // Dislike state
    const [showCommentBox, setShowCommentBox] = useState(false); // Show comment box state
    const [comment, setComment] = useState(""); // Comment text
    const [commentsList, setCommentsList] = useState<string[]>([]); // List of comments
    const scaleAnim = new Animated.Value(1); // Initial scale is 1

    const handleLike = () => {
        setIsLiked(!isLiked);

        // Trigger scale animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2, // Scale up
                duration: 150,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1, // Scale back to normal
                duration: 150,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleDislike = () => {
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false); // Reset like if already liked

        
    };

    const handleCommentSubmit = () => {
        if (comment.trim().length > 0) {
            setCommentsList([...commentsList, comment.trim()]); // Add comment to list
            setComment(""); // Clear input
            setShowCommentBox(false); // Close comment box
        }
    };

    const handleShare = async () => {
        const title =
            "The Game Awards 2024: GTA 6 crowned 'Most Anticipated Game' ahead of launch.";
        const url = generateUrl(title); // Generate URL using the title
        try {
            const result = await Share.share({
                message: `Check out this feed: ${title}\n\n${url}`,
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

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                    <Image
                        source={require("../assests/images/option.png")}
                        style={[styles.optionsIcon, { tintColor: 'white' }]} // Corrected the tintColor usage
                    />
                </TouchableOpacity>

                <View style={styles.head}>
                    <Image source={require("../assests/images/Group.png")} />
                    <Text style={styles.headerText}>Litz Chill</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.lightningIcon}>⚡</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    The Game Awards 2024: GTA 6 crowned 'Most Anticipated Game' ahead of
                    launch.
                </Text>
                <Image
                    source={require("../assests/images/feed.png")}
                    style={styles.mainImage}
                />
                <Text style={styles.description}>
                    GTA 6, which has not been officially released, won 'Most Anticipated Game' at the Game Awards 2024. The title also secured the Most Wanted Game award at the Golden Joystick Awards last month, reinforcing its high anticipation.
                </Text>

                {/* Comment Box */}
                {showCommentBox && (
                    <View style={styles.commentBox}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Type your comment..."
                            placeholderTextColor="#888"
                            value={comment}
                            onChangeText={setComment}
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
                            <Text style={styles.commentButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                )}


                    {/* Footer Icons */}
            <View style={styles.footerIcons}>
                {/* Like Button */}
                <TouchableOpacity onPress={handleLike} activeOpacity={0.8}>
                <Animated.View
                    style={[
                        styles.likeCircle,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <Image
                        source={require("../assests/images/like.png")}
                        style={[
                            styles.likeIcon,
                            { tintColor: isLiked ? "red" : undefined }, // Change thumb color dynamically
                        ]}
                    />
                </Animated.View>
            </TouchableOpacity>

                {/* Dislike Button */}
                <TouchableOpacity onPress={handleDislike}>
                    <Image
                        source={require("../assests/images/dislike.png")}
                        style={[styles.optionsIcon, styles.likeCircle,{ tintColor: isDisliked ? "blue" : "white" }]}
                    />
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity onPress={() => setShowCommentBox(!showCommentBox)}>
                    <Image
                        source={require("../assests/images/Vector.png")}
                        style={[styles.optionsIcon,styles.likeCircle]}
                    />
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity onPress={handleShare}>
                    <Image
                        source={require("../assests/images/share.png")}
                        style={[styles.optionsIcon,styles.likeCircle]}
                    />
                </TouchableOpacity>
            </View>

                {/* Display Comments */}
                {commentsList.length > 0 && (
                    <View style={styles.commentsList}>
                        {commentsList.map((item, index) => (
                            <Text key={index} style={styles.commentText}>
                                {item}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    lightningIcon: {
        color: "#f1c40f",
        fontSize: 20,
        marginRight: 16,
    },
    content: {
        marginTop: 16,
        backgroundColor: "hsba(229, 20%, 8%, 1)",
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 30,
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        marginLeft: 16,
        marginTop: 16,
    },
    mainImage: {
        width: "90%",
        height: 400,
        borderRadius: 8,
        marginBottom: 8,
        marginLeft: 16,
    },
    description: {
        color: "#EAF0F1",
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
        marginLeft: 16,
    },
    footerIcons: {
        flexDirection: "row",
        paddingVertical: 16,
        justifyContent: "center",
    },
    optionsIcon: {
        width: 24,
        height: 24,
        marginLeft: 24,
    },
    likeIcon: {
        width: 24, // Icon size
        height: 24,
    },
    likeCircle: {
        width: 30,  // Size of the circle
        height: 30, // Size of the circle
        borderRadius: 20, // Make it round
        justifyContent: "center",
        alignItems: "center",
    },
    commentBox: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "black",
    },
    commentButton: {
        marginLeft: 8,
        backgroundColor: "#007bff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    commentButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    commentsList: {
        marginTop: 16,
    },
    commentText: {
        color: "black",
        fontSize: 14,
        marginBottom: 8,
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default App;
