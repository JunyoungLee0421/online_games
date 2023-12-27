import { useParams } from "react-router-dom";

export default function Room() {
    const { roomId } = useParams();
    return (
        <div>
            you are in {roomId}
        </div>
    )
}