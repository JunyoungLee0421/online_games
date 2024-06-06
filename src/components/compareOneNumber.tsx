import React, { useState } from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`

`;

const SelectionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;

// 드롭다운 스타일 정의
const Select = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
`;

// 옵션 스타일 정의
const Option = styled.option`
  font-size: 16px;
`;

// 버튼 스타일 정의
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

const P = styled.p`
    font-size: 12;
`;

// 드롭다운 폼 컴포넌트 Props 정의
interface DropdownFormProps {
    buttonText: string;
    onButtonClick: (numA: string, numB: string) => void;
}

// 드롭다운 폼 컴포넌트
const CompareOneForm: React.FC<DropdownFormProps> = ({ buttonText, onButtonClick }) => {
    // 선택된 옵션 상태 관리
    const [playerANumber, setPlayerANumber] = useState('');
    const [playerBNumber, setPlayerBNumber] = useState('');

    // 버튼 클릭 이벤트 핸들러
    const handleButtonClick = () => {
        // 선택된 숫자 비교하는 로직 구현
        // 여기서는 임시로 console.log로 선택된 숫자들을 출력하는 것으로 대체합니다.
        console.log("Player A's number:", playerANumber);
        console.log("Player B's number:", playerBNumber);
        onButtonClick(playerANumber, playerBNumber);
    };

    return (
        <Wrapper>
            <SelectionWrapper>
                <ButtonWrapper>
                    {/* Player A의 숫자 선택 */}
                    <P>My number</P>
                    <Select value={playerANumber} onChange={(e) => setPlayerANumber(e.target.value)}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                </ButtonWrapper>

                <ButtonWrapper>
                    <P>Enemy's number</P>
                    <Select value={playerBNumber} onChange={(e) => setPlayerBNumber(e.target.value)}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                </ButtonWrapper>
                {/* Player B의 숫자 선택 */}

            </SelectionWrapper>
            {/* 버튼 */}
            <Button onClick={handleButtonClick}>{buttonText}</Button>
        </Wrapper>
    );
};

export default CompareOneForm;
