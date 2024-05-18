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

// 드롭다운 폼 컴포넌트 Props 정의
interface DropdownFormProps {
    buttonText: string;
    onButtonClick: (selectedOptions: string[]) => void;
}

// 드롭다운 폼 컴포넌트
const DropdownForm: React.FC<DropdownFormProps> = ({ buttonText, onButtonClick }) => {
    // 선택된 옵션 상태 관리
    const [selectedOptions, setSelectedOptions] = useState<string[]>(['', '', '', '']);

    // 옵션 변경 이벤트 핸들러
    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = event.target.value;
        setSelectedOptions(newSelectedOptions);
    };

    // 버튼 클릭 이벤트 핸들러
    const handleButtonClick = () => {
        onButtonClick(selectedOptions);
    };

    return (
        <Wrapper>
            <ButtonWrapper>
                {/* 드롭다운 메뉴 4개 */}
                {[...Array(4)].map((_, index) => (
                    <Select key={index} value={selectedOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                        <Option value=""></Option>
                        {/* {String.fromCharCode(65 + index)} */}
                        {[...Array(9)].map((_, optionIndex) => (
                            <Option key={optionIndex + 1} value={String(optionIndex + 1)}>{optionIndex + 1}</Option>
                        ))}
                    </Select>
                ))}
            </ButtonWrapper>

            {/* 버튼 */}
            <Button onClick={handleButtonClick}>{buttonText}</Button>
        </Wrapper>
    );
};

export default DropdownForm;
