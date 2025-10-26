import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const BackgroundDim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const DetailModal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px 40px;
  width: 30vw;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  color: #111;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #555;
`;

const ApplicantBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  label{
    font-size: 20px;
    padding: 2%;
  }

  input{
    border-radius: 10px;
    border: 1px solid black;
    padding: 3%;
    width: 100%;
    height: 5vh;
  }

  textarea{
    border-radius: 10px;
    border: 1px solid black;
    padding: 3%;
    width: 100%;
    height: 10vh;
    resize: none;
  }
`;
const ApplyBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  background: #2a62ff;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;



export default function Join({ open, onClose, postId, onCreated }) {

  const [data, setData] = useState({
    nickname: "",
    phone: "",
    note: "",
  });

  const [isApplied, setIsApplied] = useState(false);

  if (!open) return null;

  async function postApply() {
    try {
      const res = await axios.post(`https://68f63d016b852b1d6f169327.mockapi.io/participants`, {
        participant_nickname: data.nickname,
        participant_phone: data.phone,
        participant_note: data.note,
        post_id: postId,
      });
      console.log("POST 성공:", res.data);
      alert("신청이 완료되었습니다.");
      setIsApplied(true);
      onCreated?.();
      onClose?.();
    } catch (err) {
      console.log("POST 실패:", err);
      alert("신청 중 오류가 발생했습니다.");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleCancel = (e) => {
    if (window.confirm("신청을 취소하시겠습니까?")) {
      setIsApplied(false);
      setData({ nickname: "", phone: "", note: "" })
      alert("신청이 취소 되었습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!data.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    postApply();
  };



  return (
    <BackgroundDim onClick={onClose}>
      <DetailModal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h1>신청자 정보</h1>
        <ApplicantBox>
          <label>닉네임</label>
          <input
            required
            type="text"
            name="nickname"
            value={data.nickname}
            placeholder="닉네임을 입력해주세요."
            onChange={handleChange}
            disabled={isApplied}
          ></input>

          <label>전화번호</label>
          <input
            required
            type="tel"
            name="phone"
            value={data.phone}
            placeholder="전화번호를 입력해주세요."
            onChange={handleChange}
            disabled={isApplied}
          ></input>

          <label>특이사항</label>
          <textarea
            name="note"
            value={data.note}
            placeholder="요청사항을 입력해주세요.(선택사항)"
            onChange={handleChange}
            disabled={isApplied}
          ></textarea>
        </ApplicantBox>
        {isApplied ? (
          <ApplyBtn type="button" onClick={handleCancel} style={{ background: "#e74c3c" }}>
            취소하기
          </ApplyBtn>
        ) : (
          <ApplyBtn
            type="button"
            onClick={handleSubmit}
          > 신청하기
          </ApplyBtn>
        )}

      </DetailModal>
    </BackgroundDim>
  );
}
