import { useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import styled, { css } from "styled-components";
import { auth, realTimeDB } from "../firebase";
import { off, onChildChanged, onValue, ref, set, update } from "firebase/database";
import SubmitNumber from "../components/submit-number";
import CompareNumber from "../components/compare-numbers";

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 900px;
    padding: 50px 0px;
`;

const Form = styled.form`
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    justify-content: center;
`;

const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    &[type="submit"]{cursor: pointer; &:hover{opacity: 0.8;}};
    //delete updown arrows
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    &::-webkit-outer-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
    }  

    ${(props) =>
        props.disabled &&
        css`
      background-color: #eee;
      color: #aaa;
      /* Add any other styles for the disabled state */
    `}
    
`;

const Title = styled.h1`
    font-size: 24px;
`;

const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

const SelectionDiv = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;
`;

const HintDiv = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;
    margin-left: 20px;
    border: 1px solid white;
`;

const H1 = styled.h1`
`;

const Line = styled.div`
    border: 1px solid white;
    width: 420px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

export default function Room() {
    const { roomId } = useParams();

    const [isLoading, setLoading] = useState(false);

    const [numOne, setNumOne] = useState(0);
    const [numTwo, setNumTwo] = useState(0);
    const [numThree, setNumThree] = useState(0);
    const [numFour, setNumFour] = useState(0);

    const [error, setError] = useState("");

    const [opponentPlayer, setOpponentPlayer] = useState('');

    // submit을 누르면 상대를 지정 => 미래에 고려해야할것 : 여러명일때는 어떻게..?
    // compare을 누르면 get으로 상대 번호를 받아온다음에 로컬에 저장해놓으면 onValue로 매번 안받아올수있음.
    // 그럼 compare 눌렀을때 enemyNumber에 값이 없으면 받아오고 있으면 컴페어만 진행.
    // Result는 onValue로 계속 받아와야할듯? 양쪽에 필요하니까

    //update player's number when on change
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "numOne") {
            setNumOne(parseInt(value));
        } else if (name === "numTwo") {
            setNumTwo(parseInt(value));
        } else if (name === "numThree") {
            setNumThree(parseInt(value));
        } else if (name === "numFour") {
            setNumFour(parseInt(value));
        }
    }

    //check if the user got correct answer
    const onCheck = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading) return;
        try {
            setLoading(true);
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        }
        finally {
            setLoading(false);
        }
    }

    //event listener for results
    const resultRef = ref(realTimeDB, "rooms/" + roomId + "/results");
    off(resultRef);
    onChildChanged(resultRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        //updateReuslt(data);
    })
    //winning condition

    //delete data on firestore and redirect to home

    //show who is in the room

    //if it is user's turn, enable check button. Otherwise, lock it
    return (
        <Wrapper>
            <SelectionDiv>
                <Title>You are in room : {roomId}</Title>

                <Line></Line>
                <H1>Select Your Secret Number</H1>
                <SubmitNumber roomId={roomId} />
                {/* <Form onSubmit={onSubmit}>
                    <Input onChange={onChange} disabled={isSubmitted} name="numOne" value={numOne} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} disabled={isSubmitted} name="numTwo" value={numTwo} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} disabled={isSubmitted} name="numThree" value={numThree} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} disabled={isSubmitted} name="numFour" value={numFour} type="number" pattern="[0-9]" required />
                    <Input disabled={isSubmitted} type="submit" value={isLoading ? "Loading..." : "Submit Numbers"} />
                </Form>
                {error !== "" ? <Error>{error}</Error> : null} */}

                <Line></Line>
                <H1>Compare Number</H1>
                <CompareNumber roomId={roomId} />

                <Line></Line>
                <H1>Guess Opponent's Number</H1>
                <Form onSubmit={onCheck}>
                    <Input onChange={onChange} name="numOne" value={numOne} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numTwo" value={numTwo} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numThree" value={numThree} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numFour" value={numFour} type="number" pattern="[0-9]" required />
                    <Input type="submit" value={isLoading ? "Loading..." : "Check"} />
                </Form>
            </SelectionDiv>
            <HintDiv>
                <H1>Results : </H1>
            </HintDiv>
        </Wrapper>
    )
}