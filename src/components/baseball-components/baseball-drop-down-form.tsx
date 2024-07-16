import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 10px;
`;

// 드롭다운 스타일 정의
const Select = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  ${(props) =>
        props.disabled &&
        `
    opacity: 1;
    cursor: not-allowed;
  `}
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
  /* 버튼 비활성화 스타일 */
  ${(props) =>
        props.disabled &&
        `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

// 드롭다운 폼 컴포넌트 Props 정의
interface DropdownFormProps {
    isClickable: boolean;
    buttonText: string;
    onButtonClick: (selectedOptions: number[]) => void; // 숫자 배열로 변경
}

// 드롭다운 폼 컴포넌트
const BaseballDropDown: React.FC<DropdownFormProps> = ({ isClickable, buttonText, onButtonClick }) => {
    // 선택된 옵션 상태 관리 (숫자 배열로 초기화)
    const [selectedOptions, setSelectedOptions] = useState<number[]>([0, 0, 0, 0]);

    // 옵션 변경 이벤트 핸들러
    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = Number(event.target.value); // 문자열을 숫자로 변환
        setSelectedOptions(newSelectedOptions);
    };

    // 버튼 클릭 이벤트 핸들러
    const handleButtonClick = () => {
        // Check for duplicates and sum
        const duplicates = new Set(selectedOptions).size !== selectedOptions.length;
        const sum = selectedOptions.reduce((acc, curr) => acc + curr, 0);

        if (duplicates || sum !== 20) {
            alert("Please ensure there are no duplicate numbers and the sum is 20.");
            return;
        }

        onButtonClick(selectedOptions);
    };

    return (
        <Wrapper>
            <ButtonWrapper>
                {/* 드롭다운 메뉴 3개 */}
                {[...Array(3)].map((_, index) => (
                    <Select disabled={isClickable} key={index} value={selectedOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                        <Option value={0}></Option> {/* 초기값 0으로 설정 */}
                        {[...Array(10)].map((_, optionIndex) => (
                            <Option key={optionIndex} value={optionIndex}>{optionIndex}</Option>
                        ))}
                    </Select>
                ))}
            </ButtonWrapper>

            {/* 버튼 */}
            <Button disabled={isClickable} onClick={handleButtonClick}>{buttonText}</Button>
        </Wrapper>
    );
};

export default BaseballDropDown;
