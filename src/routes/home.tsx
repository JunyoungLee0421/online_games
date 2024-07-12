import { useNavigate } from "react-router-dom";
import styled from "styled-components"

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
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

export default function Home() {
  const navigate = useNavigate();
  const createRoom = () => {
    navigate("/create-room")
  }
  const joinRoom = () => {
    navigate("/join-room")
  }
  const createRoomTemp = () => {
    navigate("/create-room-selection")
  }

  return (
    <Wrapper>
      <Button onClick={createRoom}>Create a Room</Button>
      <Button onClick={joinRoom}>Join a Room</Button>
      <Button onClick={createRoomTemp}>Temp Button</Button>
    </Wrapper>
  )
}