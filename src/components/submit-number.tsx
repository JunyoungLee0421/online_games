import { ref, update } from "firebase/database";
import { useState } from "react";
import styled, { css } from "styled-components";
import { auth, realTimeDB } from "../firebase";
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

interface childComponentProp {
    roomId: string | undefined;
}

const SubmitNumber: React.FC<childComponentProp> = ({ roomId }) => {
    const roomID = roomId;
    const [isLoading, setLoading] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);

    const [numOne, setNumOne] = useState(0);
    const [numTwo, setNumTwo] = useState(0);
    const [numThree, setNumThree] = useState(0);
    const [numFour, setNumFour] = useState(0);

    const [error, setError] = useState("");

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

    //check if numbers add up to 20
    //push the numbers to database
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const addition = numOne + numTwo + numThree + numFour;
        if (isLoading) return;

        try {
            setLoading(true);
            //update numbers in database
            if (addition != 20) {
                setError("Numbers should add up to 20");
                return;
            } else {
                //set numbers to the db
                update(ref(realTimeDB, "rooms/" + roomID + `/players/player${auth.currentUser?.displayName}`), {
                    A: numOne,
                    B: numTwo,
                    C: numThree,
                    D: numFour,
                });
                //switch submitted to true => disable submit function
                setSubmitted(true);
            }
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
    return (
        <Wrapper>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} disabled={isSubmitted} name="numOne" value={numOne} type="number" pattern="[0-9]" required />
                <Input onChange={onChange} disabled={isSubmitted} name="numTwo" value={numTwo} type="number" pattern="[0-9]" required />
                <Input onChange={onChange} disabled={isSubmitted} name="numThree" value={numThree} type="number" pattern="[0-9]" required />
                <Input onChange={onChange} disabled={isSubmitted} name="numFour" value={numFour} type="number" pattern="[0-9]" required />
                <Input disabled={isSubmitted} type="submit" value={isLoading ? "Loading..." : "Submit Numbers"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>

    )
}
export default SubmitNumber;