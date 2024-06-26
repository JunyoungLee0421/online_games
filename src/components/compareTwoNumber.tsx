import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`;

const SelectionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ButtonWrapper = styled.div`
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
    isClickable: boolean;
    buttonText: string;
    onButtonClick: (playerANums: string[], playerBNums: string[]) => void;
}

// 드롭다운 폼 컴포넌트
const CompareTwoForm: React.FC<DropdownFormProps> = ({ isClickable, buttonText, onButtonClick }) => {
    // 선택된 숫자 상태 관리
    const [playerANumbers, setPlayerANumbers] = useState<string[]>(['', '']);
    const [playerBNumbers, setPlayerBNumbers] = useState<string[]>(['', '']);

    // 버튼 클릭 이벤트 핸들러
    const handleButtonClick = () => {
        // 선택된 숫자 비교하는 로직 구현
        // 여기서는 임시로 console.log로 선택된 숫자들을 출력하는 것으로 대체합니다.
        console.log("Player A's numbers:", playerANumbers);
        console.log("Player B's numbers:", playerBNumbers);
        onButtonClick(playerANumbers, playerBNumbers);
    };

    return (
        <Wrapper>
            <SelectionWrapper>
                <ButtonWrapper>
                    {/* Player A의 숫자 선택 */}
                    <P>Player A's number</P>
                    <Select value={playerANumbers[0]} onChange={(e) => setPlayerANumbers([e.target.value, playerANumbers[1]])}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                    {' + '}
                    <Select value={playerANumbers[1]} onChange={(e) => setPlayerANumbers([playerANumbers[0], e.target.value])}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                </ButtonWrapper>
                <ButtonWrapper>
                    {/* Player B의 숫자 선택 */}
                    <P>Player B's number</P>
                    <Select value={playerBNumbers[0]} onChange={(e) => setPlayerBNumbers([e.target.value, playerBNumbers[1]])}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                    {' + '}
                    <Select value={playerBNumbers[1]} onChange={(e) => setPlayerBNumbers([playerBNumbers[0], e.target.value])}>
                        <Option value=""></Option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                </ButtonWrapper>

            </SelectionWrapper>
            {/* 버튼 */}
            <Button disabled={!isClickable} onClick={handleButtonClick}>{buttonText}</Button>
        </Wrapper>
    );
};

export default CompareTwoForm;
