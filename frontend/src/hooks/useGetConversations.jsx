import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/users');  //not options are  required for this endpoint.as its an get method

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error)
                }
                setConversations(data)
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        getConversations();
    }, [])

    return { loading, conversations };
}

export default useGetConversations
