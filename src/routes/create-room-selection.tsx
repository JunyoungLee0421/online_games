import { useNavigate } from "react-router-dom";
import { Card, CardGroup, Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebase";

export default function CreateRoomSelection() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [selection, setSelection] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "roomName") {
            setRoomName(value);
        }
    };

    const onCardClick = (value: string) => {
        setSelection(value);
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
                playerA: {
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
            <Title>Create a Room with Selection</Title>
            <Form onSubmit={onSubmit}>
                <CardGroup>
                    <Card selected={selection === "balanceGame"} onClick={() => onCardClick("balanceGame")}>
                        Balance Game
                    </Card>
                    <Card selected={selection === "baseballGame"} onClick={() => onCardClick("baseballGame")}>
                        Baseball
                    </Card>
                    <Card selected={selection === "blackAndWhite"} onClick={() => onCardClick("blackAndWhite")}>
                        Black and White
                    </Card>
                </CardGroup>
                <Input
                    onChange={onChange}
                    name="roomName"
                    value={roomName}
                    placeholder="Room name"
                    type="text"
                    required
                />
                <br />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Create"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}