import { useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { addDoc, collection, } from "firebase/firestore";

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
        const roomId = generateRandomId();
        if (isLoading || roomName === "") return;
        try {
            setLoading(true);
            // await setDoc(doc(db, "rooms", roomNum), {
            //     name: roomName,
            //     players: [],
            // });
            await addDoc(collection(db, "rooms"), {
                name: roomName,
                roomId: roomId.toString(),
                players: [],
            })
            navigate(`/room/${roomId}`);
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