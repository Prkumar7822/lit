import { StyleSheet, Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;
export const styles = StyleSheet.create({
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
        height: screenHeight * 0.5, // Adjust height to fit content proportionally
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