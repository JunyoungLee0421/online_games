import { useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { collection, getDocs, query, where } from "firebase/firestore";

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
            const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setError("Room not found");
            } else {
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