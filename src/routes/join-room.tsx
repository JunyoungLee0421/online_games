import { child, get, ref, update } from "firebase/database"
import { auth, database } from "../firebase"
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
  gap: 10px;
`;

// const Button = styled.button`
//   padding: 10px 20px;
//   border-radius: 50px;
//   border: none;
//   width: 100%;
//   font-size: 16px;
//   cursor: pointer;
//     &:hover {
//       opacity: 0.8;
//     }
// `;

const RoomButton = styled.button`
  margin: 10px;
  padding: 15px 25px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const RoomName = styled.span`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const RoomType = styled.span`
  font-size: 16px;
  font-weight: normal;
`;

const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 10px;
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

interface Room {
    id: string;
    name: string;
    type: string;
}

export default function JoinRoom() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const dbRef = ref(database);
        get(child(dbRef, 'rooms/')).then((snapshot) => {
            if (snapshot.exists()) {
                const roomsData: { [key: string]: { roomname: string; gameType: string; } } = snapshot.val();
                const roomsArray: Room[] = Object.keys(roomsData).map(roomId => ({
                    id: roomId,
                    name: roomsData[roomId].roomname,
                    type: roomsData[roomId].gameType
                }));
                setRooms(roomsArray);
            } else {
                console.log("No data available");
            }
        }).catch((error: Error) => {
            console.log(error);
        });
    }, []);

    const onRoomClicked = async (roomId: String) => {
        setError("");
        try {
            setLoading(true);
            //add user to the members list of the room
            const dbRef = ref(database, 'rooms/' + roomId);
            await update(dbRef, {
                playerB: {
                    name: auth.currentUser?.displayName,
                }
            }).then(() => {
                console.log('added member successfully');
            }).catch((error) => {
                console.log(error);
            })
            //go to room with room id
            navigate("/game-room/" + roomId);
        } catch (e) {
            //show error
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Wrapper>
            <Title>Join a Room</Title>
            {rooms.map((room) => (
                <RoomButton key={room.id} onClick={() => onRoomClicked(room.id)}>
                    <RoomInfo>
                        <RoomName>Name : {room.name}</RoomName>
                        <RoomType>Type : {room.type}</RoomType>
                    </RoomInfo>
                    {isLoading ? "Connecting..." : "Join"}
                </RoomButton>
            ))}
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    );
}