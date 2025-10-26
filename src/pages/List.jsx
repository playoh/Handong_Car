import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";
import MapPreview from "./MapPreview";
import { useNavigate } from "react-router-dom";
import '../assets/styles/list.css';
import { FaUser,FaEdit, FaTrash,FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt  } from "react-icons/fa";
import axios from "axios";


function Home(){
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
    fetch("https://68f63d016b852b1d6f169327.mockapi.io/posts")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("API 불러오기 오류:", err));
  }, []);

    const filteredData = data.filter((item) => {
    const start = item.start_point?.toLowerCase() || "";
    const dest = item.destination?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return start.includes(term) || dest.includes(term);
  });

  async function deletPost(id) {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`https://68f63d016b852b1d6f169327.mockapi.io/posts/${id}`);
        alert("게시글이 삭제되었습니다.");
        
        setData((prev) => prev.filter((item) => item.post_id !== id));
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  }

  return(
    <>
        <div className="recruit-text">
          <h1>카풀 모집</h1>
          <p className = "with-text">함께 이용할 동승자를 찾아보세요</p>
        </div>
      <div className="addallign">
    
        <input
          type="text"
          className="search"
          placeholder="출발지나 도착지 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="addcar" 
          onClick={() => navigate("/create")}
        >
          + 게시글 추가
        </button>
      </div>
  
      <br/>
  
      <Card data={filteredData} onDelet={deletPost}/>
    </>
  );
};

function Card({data, onDelet}){
  const navigate = useNavigate();
    if (!Array.isArray(data)) return null; 
    
  return(
    <div className="cardallign">
      {data.map((item, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <span className={`status ${item.status === "모집중" ? "open" : "closed"}`}>
              {item.status}
            </span>
            <div className="card-actions">
              <button
              onClick={() => navigate(`/update/${item.post_id}`)}
              ><FaEdit /></button>
            <button onClick={()=>onDelet(item.post_id)}><FaTrash/></button>
            </div>
          </div>
          
          <div className="card-info">
            <p><FaUser /> {item.host_nickname}</p>
            <p><FaMapMarkerAlt /> {item.start_point} → {item.destination}</p>
            <p><FaRegClock /> {item.date} {item.time}</p>
            <p><FaUserFriends /> {item.current_people+1}/{item.total_people}</p>
            
          </div>
          <MapPreview
            startLat={item.start_lat}
            startLng={item.start_lng}
            destLat={item.dest_lat}
            destLng={item.dest_lng}
          />
          <button 
            className="detail" 
            onClick={() => navigate(`/post/${item.post_id}`)}
          >
            상세보기
          </button>

        </div>
      ))}
    </div>
  );
};


export default Home;


