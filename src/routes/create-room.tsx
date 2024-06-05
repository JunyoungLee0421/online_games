import { useNavigate } from "react-router-dom";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebase";

export default function CreateRoom() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "roomName") {
            setRoomName(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        console.log("testing");
        if (isLoading || roomName === "") return;
        try {
            setLoading(true);
            //create a room with name and id
            let roomId = Math.floor(100000 + Math.random() * 900000);
            await set(ref(database, 'rooms/' + roomId), {
                roomname: roomName,
                host: {
                    name: auth.currentUser?.displayName,
                },
                turn: auth.currentUser?.displayName
            })
            //go to game page
            navigate("/game-room/" + roomId);
        } catch (e) {
            // setError
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Wrapper>
            <Title>Create a Room</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="roomName"
                    value={roomName}
                    placeholder="Room name"
                    type="text"
                    required
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Create"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}