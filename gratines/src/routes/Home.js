import React, { useEffect, useState } from "react";
// import { getFirestore } from "firebase/firestore";
import { dbService } from '../fbase';
import { collection, addDoc, serverTimestamp, getDocs, query, getFirestore, onSnapshot, orderBy } from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();
    //forEach를 사용하지 않는 방법(reRender 하지 않아서 더 빨라짐)
    useEffect(() => {
        // getNweets();
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((document) => ({ //snapshot : 트윗을 받을때마다 알림 받는곳. 새로운 스냅샷을 받을때 nweetArray 라는 배열을 만듬
                id: document.id,
                ...document.data(), //...은 데이터의 내용물, 즉 spread attribute 기능임 
            }));
            setNweets(nweetArray); //nweets에 nweetArray 라는 배열을 집어 넣음. 배열엔 doc.id와 doc.data()가 있음
        });
    }, []);
    //Array를 먼저 만들고 forEach로 갖고오는 방법
    // const getNweets = async () => {
    //     const q = query(collection(dbService, "nweets"));
    //     const dbNweets = await getDocs(q);
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(), 
    //             id: document.id,
    //         }
    //         setNweets(prev => [nweetObject, ...prev]);
    //     });
    // };
    // useEffect(() => {
    //     getNweets();
    //     dbService.collection("nweets").onSnapshot(snapshot => {
    //     })
    // }, []);
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
        await addDoc(collection(dbService, "nweets"), { //addDoc은 문서를 추가하는 함수. 아래 항목을 nweets의 데이터베이스에 저장함.
            text : nweet,
            createdAt: serverTimestamp(),
            creatorId: userObj.uid,
            //nweets에 새로운 데이터를 넣고싶으면 이곳에 추가하기.
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

    //사진파일 추가
    const onFileChange = (event) => {
        // console.log(event.target.files)
        const {
            target: { files },
        } = event;
        const theFile = files[0]; //name, size, type, 등등 파일의 정보
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setAttachment(finishedEvent.target.result)
        }
        reader.readAsDataURL(theFile);
    }
    //사진파일 업로드 전 지우기
    const onClearAttachment = () => setAttachment(null)
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
                <input
                    type="file"
                    accept="image/*"
                    onChange = {onFileChange}
                />
                <input type="submit" value="Nweet" />
                {attachment &&
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear Image</button>
                    </div>
                }
            </form>
            <div>
                {nweets.map((nweet) => ( //map은 for과 유사함. 배열안의 값들을 다 불러와주는 기능 / 지금으로썬, nweets 배열안의 데이터(doc.id / doc.data())를 다 불러옴
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet} //id, createdAt, text 3가지 값 갖고있음
                        isOwner={nweet.creatorId === userObj.uid} //내가 실제 주인인지 //맞으면 true 값 뱉음
                    />
                ))}
            </div>
        </div>
    );
}
export default Home;