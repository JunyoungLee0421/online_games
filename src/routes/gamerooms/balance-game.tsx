import { useParams } from "react-router-dom";

export default function BalanceGame() {
    const { room_id } = useParams();

    return <h1>balance game with : {room_id}</h1>
}