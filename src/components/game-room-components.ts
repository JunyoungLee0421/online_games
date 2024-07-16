import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GamePlayWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FormWrapper = styled.div`
  width: 400px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 위아래 간격 */
`;

export const H1 = styled.p`
  font-size: 18px; /* 글씨체 크기 */
  margin-bottom: 20px; /* 간격 */
`;

export const HintWrapper = styled.div`
  width: 500px;
  border: 1px solid black;
  margin-left: 10px;
  border-radius: 10px; /* 모서리 둥글게 */
  background-color: #f9f9f9; /* 배경색 추가 */
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate; /* 테두리 분리 */
  text-align: center; /* 텍스트 왼쪽 정렬 */
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2; /* 줄무늬 배경색 */
  }
`;

export const TableHeader = styled.th`
  border: 2px solid #ddd;
  margin-bottom: 10px; /* 헤더 사이 간격 */
  margin-left: 20px;
  padding: 12px 15px; /* 패딩 추가 */
  background-color: #779ee8;
  color: white;
  &:first-child {
    border-top-left-radius: 10px; /* 좌상단 모서리 둥글게 */
  }

  &:last-child {
    border-top-right-radius: 10px; /* 우상단 모서리 둥글게 */
  }
`;

export const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 12px 15px; /* 패딩 추가 */
  margin-bottom: 10px; /* 셀 사이 간격 */
`;
