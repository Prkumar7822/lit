import { useState, useEffect } from 'react';
import { fetchFeedData } from '../services/ApiService'
import { FeedItem } from '../Model/FeedItem';

const useFeed = (token: string) => {
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const loadFeed = async () => {
            setLoading(true);
            const data = await fetchFeedData(token, page);
            if (data) {
                setFeedData((prev) => [...prev, ...data.data]);
            }
            setLoading(false);
        };
        loadFeed();
    }, [page]);

    return { feedData, loading, setPage };
};

export default useFeed;
