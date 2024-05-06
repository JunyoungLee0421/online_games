import { child, get, ref } from "firebase/database"
import { database } from "../firebase"
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
`;

export const Title = styled.h1`
  font-size: 42px;
`;

interface Room {
    id: string;
    name: string;
}

export default function JoinRoom() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const dbRef = ref(database);
        get(child(dbRef, 'rooms/')).then((snapshot) => {
            if (snapshot.exists()) {
                const roomsData: { [key: string]: { roomname: string } } = snapshot.val();
                const roomsArray: Room[] = Object.keys(roomsData).map(roomId => ({
                    id: roomId,
                    name: roomsData[roomId].roomname,
                }));
                setRooms(roomsArray);
            } else {
                console.log("No data available");
            }
        }).catch((error: Error) => {
            console.log(error);
        });
    }, []);

    return (
        <Wrapper>
            <Title>Join a Room</Title>
            {rooms.map(room => (
                <Button key={room.id} onClick={() => navigate("/game-room/" + room.id)}>{room.name}</Button>
            ))}
        </Wrapper>
    );
}