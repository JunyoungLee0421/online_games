import { useParams } from "react-router-dom"

export default function GameRoom() {
    const { room_id } = useParams();

    return <h1>Game room : {room_id}</h1>
}