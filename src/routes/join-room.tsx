import { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function JoinRoom() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "roomId") {
            setRoomId(value);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || roomId === "") return;
        try {
            setLoading(true);
            //데이터베이스에서 룸 확인하기
            const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
            const querySnapshot = await getDocs(q);
            //같은 아이디의 방이 있으면 이동, 아니면 에러메세지
            if (querySnapshot.empty) {
                setError("Room not found");
            } else {
                //데이터베이스에 유저 정보 추가하기
                const docRef = doc(db, "rooms", roomId);
                await updateDoc(docRef, {
                    players: arrayUnion({
                        player: auth.currentUser?.displayName,
                        numberOne: 1,
                        numberTwo: 1,
                        numberThree: 1,
                        numberFour: 1,
                    })
                });
                //이동
                navigate(`/room/${roomId}`);
            }
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Wrapper>
            <Title>Join Room</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="roomId" value={roomId} placeholder="roomId" type="text" required />
                <Input type="submit" value={isLoading ? "Loading..." : "Join Room"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}