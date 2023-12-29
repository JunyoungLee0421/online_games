import { useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import styled from "styled-components";

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
`;

const Title = styled.h1`
font-size: 24px;
`;

const Error = styled.span`
font-weight: 600;
color: tomato;
`;

const Switcher = styled.span`
    margin-top : 20px;
    a {
        color: #1d9bf0;
    }
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
    margin-top: 20px;
    font-size: 18px;
`;

export default function Room() {
    const { roomId } = useParams();
    const [isLoading, setLoading] = useState(false);
    const [isMyTurn, setTurn] = useState(false);
    // const [turn, setTurn] = useState("A");
    const [error, setError] = useState("");

    const [numOne, setNumOne] = useState(0);
    const [numTwo, setNumTwo] = useState(0);
    const [numThree, setNumThree] = useState(0);
    const [numFour, setNumFour] = useState(0);


    //update player's number
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

    //check if numbers add up to 20
    //push the numbers to database
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const addition = numOne + numTwo + numThree + numFour;
        if (isLoading) return;
        if (addition != 20) {
            setError("Numbers should add up to 20");
            return;
        }

        try {
            setLoading(true);
            //update numbers in database
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        }
        finally {
            //set loading to false
            setLoading(false);
            //disable submit button
        }
    }

    //append result & switch turn
    const onCompare = async (e: React.FormEvent<HTMLFormElement>) => {
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
    //winning condition

    //delete data on firestore and redirect to home

    //show who is in the room

    //if it is user's turn, enable check button. Otherwise, lock it
    return (
        <Wrapper>
            <SelectionDiv>
                <Title>You are in room : {roomId}</Title>
                <H1>Select Your Secret Number</H1>
                <Form onSubmit={onSubmit}>
                    <Input onChange={onChange} name="numOne" value={numOne} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numTwo" value={numTwo} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numThree" value={numThree} type="number" pattern="[0-9]" required />
                    <Input onChange={onChange} name="numFour" value={numFour} type="number" pattern="[0-9]" required />
                    <Input type="submit" value={isLoading ? "Loading..." : "Submit Numbers"} />
                </Form>
                <H1>Compare Number</H1>
                <Form>
                    <label htmlFor="playerRed">Player Red's : </label>
                    <select name="options" id="playerRed">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <label htmlFor="playerBlue">Player Blue's : </label>
                    <select name="options" id="playerBlue">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </Form>
                <H1>Or</H1>
                <Form>
                    <label htmlFor="playerRed">Player Red's : </label>
                    <select name="options" id="playerRed">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <p> + </p>
                    <select name="options" id="playerRed">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <label htmlFor="playerRed">Player Blue's : </label>
                    <select name="options" id="playerRed">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <p> + </p>
                    <select name="options" id="playerRed">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </Form>
                <Form onSubmit={onCompare}>
                    <Input type="submit" value={isLoading ? "Loading..." : "Compare"} />
                </Form>

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