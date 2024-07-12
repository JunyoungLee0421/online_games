import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 40px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid black;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
    margin-top: 20px;
    a {
        color: #1d9bf0;
    }
`;

export const CardGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
  margin: 20px 0;
`;

export const Card = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid ${props => (props.selected ? "#1d9bf0" : "black")};
  background-color: ${props => (props.selected ? "#eaf6ff" : "white")};
  cursor: pointer;
  width: 100%;
  text-align: center;
  &:hover {
    opacity: 0.8;
  }
`;