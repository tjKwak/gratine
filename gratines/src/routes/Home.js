import React, { useEffect, useState } from "react";
// import { getFirestore } from "firebase/firestore";
import { dbService } from '../fbase';
import { collection, addDoc, serverTimestamp, getDocs, query, getFirestore } from "firebase/firestore";

const Home = ( {userObj} ) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const q = query(collection(dbService, "nweets"));
        const dbNweets = await getDocs(q);
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(), //...은 데이터의 내용물, 즉 spread attribute 기능임
                id: document.id,
            }
            setNweets(prev => [nweetObject, ...prev]);
        });
    };
    useEffect(() => {
        getNweets();
    }, []);
    // const onSubmit = (event) => {
    //     event.preventDefault();
    //     dbService.collection("nweets").add({
    //         nweet,
    //         createAt: Date.now(),
    //     })
    //     setNweet("");
    // }
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(`현재 쓴 트윗:${nweet}`);
        await addDoc(collection(dbService, "nweets"), {
        text : nweet,
        createdAt: serverTimestamp(),
        creatorId: userObj.uid,
        });
        setNweet("");
    };
    const onChange = (e) => {
        setNweet(e.target.value);
    };
    // const onChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setNweet(value);
    // }
    return (
        <div>
            <span>Home</span>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120} />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <div key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Home;