import { Link } from "react-router-dom";
import { Switcher, Wrapper } from "../components/auth-components";

export default function Home() {
    return (
        <Wrapper>
            <Switcher>
                <Link to="/create">Create Room </Link>
            </Switcher>
            <Switcher>
                <Link to="/join">Join Room </Link>
            </Switcher>
        </Wrapper>
    );
}