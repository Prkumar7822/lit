import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity
, FlatList, Modal } from "react-native";
import React, { useEffect, useState, useRef } from "react";

 import { FeedItem } from "../Model/FeedItem";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from '../../App'; // Import the param list
import Video from 'react-native-video'; // Import video player component
import { ListRenderItem } from "react-native";
import { Button } from "react-native";
import LikesComponent from "./LikesComponent";




type NavigationProp = StackNavigationProp<StackParamList, "Home">;

const HomeScreen = () => {
    type NavigationProp = StackNavigationProp<StackParamList, "Home">;

        const navigation = useNavigation<NavigationProp>();

            const flatListRef = useRef<FlatList>(null);

             const [feedData, setFeedData] = useState<FeedItem[]>([]);
                const [currentComment, setCurrentComment] = useState<string>("");
                const [loading, setLoading] = useState<boolean>(false);
                const [page, setPage] = useState<number>(1);
                const [showCommentBox, setShowCommentBox] = useState(false);
                const [comment, setComment] = useState("");
                const [commentsList, setCommentsList] = useState<string[]>([]);
                const [commentMemeId, setCommentMemeId] = useState<string | null>(null); // Track the meme ID for which the comment box is shown
                const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
                const [swipeCount, setSwipeCount] = useState<number>(0);
                const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
                const [remainingSwipes, setRemainingSwipes] = useState<number>(3);
                const [likedMemes, setLikedMemes] = useState<Set<string>>(new Set());
                const [dislikedMemes, setDislikedMemes] = useState<Set<string>>(new Set());
        
    

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



        const renderItem: ListRenderItem<FeedItem> = ({ item, index }) => (
            <View style={styles.fullScreenContainer}>
                <View style={styles.titlecontainer}>
                    <Text>HIII</Text>
                    <Text numberOfLines={1} style={styles.title}>{item.meme_title}</Text>
                </View>
                <View style={styles.videocontainer}>
                    {item.image_url ? (
                        <Video
                            source={{ uri: item.image_url }}
                            style={styles.mainImage}
                            controls={false}
                            resizeMode="cover"
                            repeat={true}
                            playInBackground={false}
                            paused={currentPlayingIndex !== index}
                        />
                    ) : (
                        <Image source={{ uri: item.image_url }} style={styles.mainImage} />
                    )}
                </View>
                <View style={styles.desccontianer}>
    
    
                    <Text numberOfLines={3} style={styles.description}>{item.description}</Text>
                </View>
    
                <View style={styles.footerIcons}>
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleLike(index)}>
                            <Image
                                source={require("../assests/images/like.png")}
                                style={[styles.optionsIcon, { tintColor: item.isLiked ? "red" : "white" }]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleDislike(index)}>
                            <Image
                                source={require("../assests/images/dislike.png")}
                                style={[styles.optionsIcon, { tintColor: item.isDisliked ? "blue" : "white" }]}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {
                     handleCommentIconPress(item.meme_id)
                    }}>
                        <View style={styles.iconCircle}>
                            <Image
                                source={require("../assests/images/Vector.png")}
                                style={styles.optionsIcon}
                            />
                        </View>
                    </TouchableOpacity>
    
                    <View style={styles.iconCircle}>
                        <TouchableOpacity onPress={() => handleShare(item.meme_id)}>
                            <Image
                                source={require("../assests/images/share.png")}
                                style={[styles.optionsIcon, { tintColor: "white" }]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Comment Input Box */}
                {showCommentBox && commentMemeId === item.meme_id && (
                    <View style={styles.commentBox}>
                        <TextInput
                            style={styles.commentInput}
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Add a comment..."
                            placeholderTextColor="gray"
                        />
                        <Button title="Post" onPress={handleCommentSubmit} />
                    </View>
                )}
            </View>
        );
    

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
                       <View style={styles.modalContent}>
                           <TouchableOpacity style={styles.closeButton} onPress={() => setShowLoginModal(false)}>
                               <Image source={require("../assests/images/cross.png")} style={styles.closeIcon} />
                           </TouchableOpacity>
                           <Image source={require("../assests/images/lock.png")} />
                           <Text style={styles.modalText}>Unlock Full Access!</Text>
                           <Text style={styles.modalText}>Log in to access meme feeds, comment, share, view flash news, and much more.</Text>
                           <Text style={styles.abovelogin}>You’re one step away!.</Text>
                           <TouchableOpacity style={styles.loginButton} onPress={() => { /* Handle login */ }}>
                               <Text style={styles.loginButtontext}>Login</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </Modal>
           </View>
       );
};

const screenHeight = Dimensions.get("window").height;

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
        height: screenHeight * 0.5  , // Adjust height to fit content proportionally
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
        justifyContent : 'center',
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
        width: "90%",
        padding: 20,
        backgroundColor: "#1c1c1e", // Dark theme consistency
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 20, // Add spacing from the bottom
    },
    modalText: {
        fontSize: 18,
        color: "white", // Match theme
        textAlign: "center",
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
        alignItems: 'center',
        marginTop: 16,
        padding: 8,
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
    icon:{
        height: 24,
        width: 24,
        marginLeft: 10,
        justifyContent: 'center',
        alignContent: 'center',
    }
});

export default HomeScreen;