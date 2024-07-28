import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import JoinRoom from "./routes/join-room";
import GameRoom from "./routes/game-room";
import BalanceGame from "./routes/gamerooms/balance-game";
import BaseBallGame from "./routes/gamerooms/baseball";
import BlackAndWhiteGame from "./routes/gamerooms/black-and-white";
import CreateRoom from "./routes/create-room";
import BaseballFourDigit from "./routes/gamerooms/baseball-4digit";
import BlackAndWhiteTwo from "./routes/gamerooms/black-and-white-two";
import Monorail from "./routes/gamerooms/monorail";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "create-room",
        element: <CreateRoom />
      },
      {
        path: "join-room",
        element: <JoinRoom />
      },
      {
        path: "game-room/:room_id",
        element: <GameRoom />
      },
      {
        path: "balanceGame/:room_id",
        element: <BalanceGame />
      },
      {
        path: "baseballGame/:room_id",
        element: <BaseBallGame />
      },
      {
        path: "baseballFourDigit/:room_id",
        element: <BaseballFourDigit />
      },
      {
        path: "blackAndWhiteGame/:room_id",
        element: <BlackAndWhiteGame />
      },
      {
        path: "blackAndWhiteTwo/:room_id",
        element: <BlackAndWhiteTwo />
      },
      {
        path: "monorails/:room_id",
        element: <Monorail />
      },

    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  }
]);

const GlobalStyles = createGlobalStyle`
${reset};
* {
  box-sizing: border-box;
}
body {
  background-color: white;
  color: black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    //wait for firebase
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
