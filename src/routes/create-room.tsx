import { useState } from "react";
import { auth, db, realTimeDB } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { doc, setDoc, } from "firebase/firestore";
import { ref, set } from "firebase/database";

export default function CreateRoom() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "roomName") {
            setRoomName(value);
        }
    }

    const generateRandomId = () => {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const roomId = generateRandomId().toString();
        if (isLoading || roomName === "") return;
        try {
            setLoading(true);
            //데이터베이스에 방 생성하기
            // await setDoc(doc(db, "rooms", roomId), {
            //     name: roomName,
            //     roomId: roomId,
            //     players: [{
            //         player: auth.currentUser?.displayName,
            //         numberOne: 0,
            //         numberTwo: 0,
            //         numberThree: 0,
            //         numberFour: 0,
            //     }],
            //     turn: "A",
            // })
            await set(ref(realTimeDB, "rooms/" + roomId), {
                name: roomName,
                roomId: roomId.toString(),
                players: [],
                turn: "A",
            });
            // await addDoc(collection(db, "rooms"), {
            //     name: roomName,
            //     roomId: roomId.toString(),
            //     players: [],
            //     turn: "A",
            // })
            // navigate(`/room/${roomId}`);
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
            <Title>Create Room</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="roomName" value={roomName} placeholder="roomName" type="text" required />
                <Input type="submit" value={isLoading ? "Loading..." : "Create Room"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}