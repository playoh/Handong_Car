import axios from "axios";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const popIn = keyframes`
  0% { transform: scale(.96) translateY(8px); opacity: 0 }
  100% { transform: scale(1) translateY(0); opacity: 1 }
`;

const BackgroundDim = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0,0,0,.35);
  backdrop-filter: saturate(120%) blur(6px);
  -webkit-backdrop-filter: saturate(120%) blur(6px);
  z-index: 999;
  animation: ${fadeIn} .18s ease-out;
`;

const DetailModal = styled.div`
  position: relative;
  width: min(560px, 92vw);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 28px 28px 24px;
  box-shadow:
    0 20px 50px rgba(0,0,0,0.20),
    0 2px 10px rgba(0,0,0,0.06);
  animation: ${popIn} .22s cubic-bezier(.2,.7,.2,1);
  border: 1px solid rgba(0,0,0,0.06);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.2px;
    color: #0f172a;
  }
  small {
    color: #6b7280;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  inline-size: 36px;
  block-size: 36px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: white;
  color: #334155;
  display: grid;
  place-items: center;
  font-size: 18px;
  cursor: pointer;
  transition: all .15s ease;

  &:hover { transform: scale(1.04); box-shadow: 0 6px 14px rgba(2,6,23,.08); }
  &:active { transform: scale(.98); }
`;

const ApplicantBox = styled.form`
  display: grid;
  gap: 14px;
  margin-top: 6px;

  .field {
    display: grid;
    gap: 8px;
  }

  label{
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    letter-spacing: .1px;
  }

  input, textarea{
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 12px 14px;
    font-size: 15px;
    color: #0f172a;
    outline: none;
    transition: border-color .12s ease, box-shadow .12s ease, background .12s ease;

    &:hover {
      border-color: #d1d5db;
      background: #fff;
    }
    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59,130,246,.15);
    }
    &:disabled {
      background: #f8fafc;
      color: #94a3b8;
      cursor: not-allowed;
    }
  }

  textarea{
    min-height: 110px;
    resize: none; /* 사용자가 크기 조절 못하게 */
  }
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 8px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .06s ease, box-shadow .15s ease, background .15s ease, color .15s ease;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  letter-spacing: .2px;

  &:active { transform: translateY(1px); }
`;

const PrimaryBtn = styled(Button)`
  background: #2563eb;
  color: #fff;

  &:hover { background: #1d4ed8; box-shadow: 0 12px 26px rgba(37,99,235,.25); }
  &:disabled {
    background: #cbd5e1;
    color: #fff;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const DangerBtn = styled(Button)`
  background: #fee2e2;
  color: #991b1b;

  &:hover { background: #fecaca; }
`;

export default function Join({
  open,
  onClose,
  postId,
  onCreated,
  current_people,
  total_people,
  status
}) {
  const [data, setData] = useState({
    nickname: "",
    phone: "",
    note: "",
  });
  const [isApplied, setIsApplied] = useState(false);

  if (!open) return null;

  async function postApply() {
    try {
      if (Number(current_people) >= Number(total_people)) {
        alert("이미 모집이 마감되었습니다.");
        return;
      }
      const res = await axios.post(
        `https://68f63d016b852b1d6f169327.mockapi.io/participants`,
        {
          participant_nickname: data.nickname,
          participant_phone: data.phone,
          participant_note: data.note,
          post_id: postId,
        }
      );
      console.log("참가자 POST 성공:", res.data);

      await postCurrentPeople();

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
      setData({ nickname: "", phone: "", note: "" });
      alert("신청이 취소 되었습니다.");
    }
  };

  async function postCurrentPeople() {
    try {
      const getRes = await axios.get(
        `https://68f63d016b852b1d6f169327.mockapi.io/posts/${postId}`
      );
      const prev = getRes.data;

      const cur = Number(prev?.current_people ?? 0);
      const tot = Number(prev?.total_people ?? 0);
      const nextCurrent = cur + 1;
      const isFull = nextCurrent >= tot;

      const payload = {
        current_people: nextCurrent,
        status: isFull ? "모집 마감" : "모집중",
      };

      const putRes = await axios.put(
        `https://68f63d016b852b1d6f169327.mockapi.io/posts/${postId}`,
        payload
      );

      console.log("POST current_people put 성공:", putRes.data);
      return putRes.data;
    } catch (e) {
      console.error("POST current_people put 실패:", e?.response || e);
      throw e;
    }
  }

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
        <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>

        <Header>
          <h1>신청자 정보</h1>
          <small>필수 항목을 입력해주세요</small>
        </Header>

        <ApplicantBox onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              required
              type="text"
              name="nickname"
              value={data.nickname}
              placeholder="닉네임을 입력해주세요."
              onChange={handleChange}
              disabled={isApplied}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">전화번호</label>
            <input
              id="phone"
              required
              type="tel"
              name="phone"
              value={data.phone}
              placeholder="전화번호를 입력해주세요."
              onChange={handleChange}
              disabled={isApplied}
            />
          </div>

          <div className="field">
            <label htmlFor="note">특이사항 (선택)</label>
            <textarea
              id="note"
              name="note"
              value={data.note}
              placeholder="요청사항을 입력해주세요."
              onChange={handleChange}
              disabled={isApplied}
            />
          </div>

          <ButtonRow>
            {isApplied ? (
              <DangerBtn type="button" onClick={handleCancel}>
                취소하기
              </DangerBtn>
            ) : (
              <>
                <PrimaryBtn type="submit">신청하기</PrimaryBtn>
                <Button
                  type="button"
                  onClick={onClose}
                  style={{ background: "#f1f5f9", color: "#0f172a" }}
                >
                  닫기
                </Button>
              </>
            )}
          </ButtonRow>
        </ApplicantBox>
      </DetailModal>
    </BackgroundDim>
  );
}
