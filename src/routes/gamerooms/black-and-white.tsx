import { useParams } from "react-router-dom";

export default function BlackAndWhiteGame() {
    const { room_id } = useParams();

    return <h1>black and white game with : {room_id}</h1>
}