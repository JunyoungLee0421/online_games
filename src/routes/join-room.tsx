import { useState } from "react";
import { auth, realTimeDB } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Title, Wrapper } from "../components/auth-components";
import { onValue, ref, set } from "firebase/database";

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
            const Roomref = ref(realTimeDB, "rooms/");
            onValue(Roomref, (snapshot) => {
                const data = snapshot.val();
                const roomIds = Object.keys(data);
                //방이없으면 에러
                if (!snapshot.exists()) {
                    setError("There is no room at the moment");
                }  //방이있으면 배열형식으로 저장
                else {
                    for (const room of roomIds) {
                        console.log(room);
                        if (roomId === room) {
                            console.log("Room found!");
                            //set player two info
                            set(ref(realTimeDB, "rooms/" + roomId + "/players/playerTwo"), {
                                playerName: auth.currentUser?.displayName,
                            });
                            //go to room
                            navigate(`/room/${roomId}`);
                            //finish function
                            return;
                        } else {
                            console.log("Room not found!");
                        }
                    }
                }
            });
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