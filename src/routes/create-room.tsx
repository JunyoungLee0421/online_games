import { useNavigate } from "react-router-dom";
import { Card, CardGroup, Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebase";
import { H1 } from "../components/game-room-components";

export default function CreateRoom() {
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
        if (isLoading || roomName === "") return;
        try {
            setLoading(true);
            console.log(selection);
            // //create a room with name and id
            let roomId = Math.floor(100000 + Math.random() * 900000);
            await set(ref(database, 'rooms/' + roomId), {
                roomname: roomName,
                playerA: {
                    name: auth.currentUser?.displayName,
                },
                turn: auth.currentUser?.displayName,
                gameType: selection
            });
            //go to game page
            navigate(`/${selection}/` + roomId);
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
                <H1>1. Select Game Type</H1>
                <CardGroup>
                    <Card selected={selection === "balanceGame"} onClick={() => onCardClick("balanceGame")}>
                        Balance Game
                    </Card>
                    <Card selected={selection === "baseballGame"} onClick={() => onCardClick("baseballGame")}>
                        Baseball (3-digit)
                    </Card>
                    <Card selected={selection === "baseballFourDigit"} onClick={() => onCardClick("baseballFourDigit")}>
                        Baseball (4-digit)
                    </Card>
                </CardGroup>
                <CardGroup>
                    <Card selected={selection === "blackAndWhiteGame"} onClick={() => onCardClick("blackAndWhiteGame")}>
                        Black and White
                    </Card>
                    <Card selected={selection === "blackAndWhiteTwo"} onClick={() => onCardClick("blackAndWhiteTwo")}>
                        Black and White II
                    </Card>
                    <Card selected={selection === "monorails"} onClick={() => onCardClick("monorails")}>
                        Monorails
                    </Card>
                </CardGroup>
                <H1>2. Enter Room name</H1>
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