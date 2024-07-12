import { useParams } from "react-router-dom";

export default function BaseBallGame() {
    const { room_id } = useParams();

    return <h1>baseball game with : {room_id}</h1>
}