import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { styles } from '../component/styles';
interface ShareComponentProps {
    onShare: () => void;
}

const ShareComponent: React.FC<ShareComponentProps> = ({ onShare }) => {
    return (
        
        <TouchableOpacity onPress={onShare} style={styles.iconCircle}>
            <Image
                source={require("../assests/images/share.png")} 
                style={[styles.optionsIcon, { tintColor: "white" }]}
            />
        </TouchableOpacity>
    );
};

export default ShareComponent;  