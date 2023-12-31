import { ref, set } from "firebase/database";
import { useState } from "react";
import styled, { css } from "styled-components";
import { realTimeDB } from "../firebase";
import { FirebaseError } from "firebase/app";

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
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

const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

const H1 = styled.h1`
`;

interface childComponentProp {
    roomId: string | undefined;
}

const CompareNumber: React.FC<childComponentProp> = ({ roomId }) => {
    const [isLoading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [count, setCount] = useState(0);

    //append result & switch turn
    const onCompare = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading) return;
        try {
            setLoading(true);
            set(ref(realTimeDB, "rooms/" + roomId + "/results"), {
                result: count,
            });
            setCount(count + 1);
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Wrapper>
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
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}

export default CompareNumber;