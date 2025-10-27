import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../../services/supabaseClient";

function MemberManage({ adminInfo, onLogout }) {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", {ascending : false});

    if(error) {
      console.error("회원 정보 불러오기 실패", error.message);
    } else {
      setMembers(data);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return(
    <div className="admin-board">
      <div className="admin-right">
        <div className="admin-header"><Header /></div>

        <div className="admin-title">
          <h3>회원 관리</h3>
          <p>회원관리를 추가, 편집, 삭제할 수 있습니다. </p>
        </div>

        <div className='admin-menu-list'>
          <div className="admin-service member-default">
            <table className="admin-list-tb">
              <thead>
                <tr>
                  <th style={{width:"2%"}}>No</th>
                  <th style={{width:"2%"}}>
                    <input type="checkbox" name="" id="" />
                  </th>
                  <th style={{width:"12%"}}>이메일</th>
                  <th>이름</th>
                  <th>등급</th>
                  <th>전화번호</th>
                  <th style={{width:"34%"}}>주소</th>
                  <th>등록일</th>
                  <th>상세정보</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input type="checkbox" name="" id="" />
                  </td> 
                  <td>{member.email}</td>
                  <td>{member.name}</td>
                  <td>일반회원</td>
                  <td>{member.phone}</td>
                  <td>
                    {member.address}
                    {/*
                    <span style={{marginRight:"10px"}}>16269</span>
                    <span>경기도 수원시 장안구 정조로 940-1(영화동, 연세IT미래교육원 빌딩)</span> 
                    */}
                  </td>
                  <td>{new Date(member.created_at).toLocaleDateString()}</td>
                  <td>
                    <button type="button">보기</button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  )
};

export default MemberManage;