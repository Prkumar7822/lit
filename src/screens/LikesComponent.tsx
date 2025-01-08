import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { handleLike } from '../services/api';

const Like = ({ itemId }) => {
    const onLike = () => {
        handleLike(itemId); // Call API for like
    };

    return (
        <TouchableOpacity onPress={onLike}>
            <Image source={require('../assets/like_icon.png')} style={styles.icon} />
        </TouchableOpacity>
    );
};

export default Like;
