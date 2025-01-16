import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Video from 'react-native-video';
import LikeComponent from '../screens/LikesComponent';
import DislikeComponent from '../screens/DislikesComponent';
import ShareComponent from '../screens/ShareComponent';
import CommentsComponent from '../screens/CommentsComponent';
import { fetchFeedData, fetchComments } from '../services/ApiService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';
import { FeedItem, Comment, ApiResponse } from '../Model/interfaces';
import { styles } from '../component/styles';
import LikesComponent from './LikesComponent';

type NavigationProp = StackNavigationProp<StackParamList, 'Home'>;

const App: React.FC = () => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
    const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);
    const [selectedComments, setSelectedComments] = useState<{ [key: string]: Comment[] }>({});

    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ApiResponse = await fetchFeedData();
                console.log('Fetched feed data:', response.data);
                setFeedData(response.data || []);
            } catch (error) {
                console.error('Error fetching feed data:', error);
            }
        };
        fetchData();
    }, []);

    const handleCommentIconPress = async (meme_id: string) => {
        try {
            setSelectedMemeId(meme_id);
            setShowCommentBox(true);

            if (!selectedComments[meme_id]) {
                const response = await fetchComments(meme_id);
                setSelectedComments((prev) => ({ ...prev, [meme_id]: response.data || [] }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const renderItem = ({ item }: { item: FeedItem }) => (
        <View style={styles.fullScreenContainer}>
            <View style={styles.titlecontainer}>
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
                    // paused={currentPlayingIndex !== index}
                    />
                ) : (
                    <Image source={{ uri: item.image_url }} style={styles.mainImage} />
                )}
            </View>
            <View style={styles.desccontianer}>


                <Text numberOfLines={3} style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.footerIcons}>
                <LikeComponent meme_id={item.meme_id}
                    comment_id='' // Or provide a value if it's a comment
                    isLiked={item.liked_by_current_user}
                    feedData={feedData} />
                <DislikeComponent meme_id={item.meme_id} isDisliked={item.disliked_by_current_user} onDislike={() => { }} />
                <TouchableOpacity style={styles.iconCircle} onPress={() => handleCommentIconPress(item.meme_id)}>
                    <Image source={require("../assests/images/Vector.png")} />

                </TouchableOpacity>
                <ShareComponent onShare={() => { }} />
            </View>
        </View>
    );

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


    return (
        <View style={styles.container}>
            <NavigationBar />
            <FlatList data={feedData} renderItem={renderItem} keyExtractor={(item) => item.meme_id} />
            {showCommentBox && selectedMemeId && (
                <CommentsComponent
                    meme_id={selectedMemeId}
                    comments={selectedComments[selectedMemeId]}
                    onClose={() => setShowCommentBox(false)}

                />
            )}
        </View>
    );
};


export default App;
