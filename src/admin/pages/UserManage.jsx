import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser, removeUser, updateUser,} from "../../services/userService";
import { getUserImageUrl } from "../../services/userImageService";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import AddUserPopup from "../popup/AddUserPopup";

function UserManage() {
  const [users, setUsers] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  
  // 직원 목록 불러오기
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      const sorted = [...fetchedUsers].sort(
        (a, b) => new Date(a.joined_at) - new Date(b.joined_at)
      );
      setUsers(sorted);
    } catch (err) {
      console.error("직원 목록 불러오기 실패:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    getUsers()
      .then(fetchedUsers => {
        // 입사일 기준 정렬
        const sorted = [...fetchedUsers].sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at));
        setUsers(sorted);
      })
      .catch(console.error);
  }, []);

  const handleAddUser = (savedUser) => {
    setUsers(prev => [...prev, savedUser]); // 항상 맨 뒤에 추가
  };

  const handleRemove = async (id) => {
    await removeUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // 직원 편집: 기존 위치 유지
  const handleEditUser = (savedUser) => {
    setUsers(prev =>
      prev.map(user => user.id === savedUser.id ? { ...user, ...savedUser } : user)
    );
  }
  
  // UTC → KST 변환 함수
  function formatToKST(utcString) {
    if (!utcString) return "";
    return new Date(utcString).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  }

  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };

  return(
    <div className="admin-board">
      <div className="admin-left">
        <Sidebar />
      </div>
      <div className="admin-right">
        <div className="admin-header">
          <AdminHeader />
        </div>

        <div className='admin-menu-list'>
          <div className="admin-title">
            <h3>직원 관리</h3>
            <p>직원 정보를 추가, 편집, 삭제할 수 있습니다.</p>
            <button onClick={() => setShowAddPopup(true)}>
              <i className="bi bi-bag-plus"></i>직원 추가
            </button>
          </div>

          <div className="admin-service user-service">
            {users.map(user => (
              <div className="manager" key={user.id}>
                {/* 직원 정보 표시 */}
                <div className="manager-user">

                  <img
                    src={getUserImageUrl(user.profile_img)}
                    alt={`${user.name}의 프로필`}
                    className="admin-profile"
                  />

                  <div className="manager-name">
                    <p className="name">{user.name}</p>
                    <p className="job">{user.role}</p>
                    <span>{user.status}</span>
                  </div>
                </div>

                <div className="manager-list">
                  <ul>
                    <li><i className="bi bi-envelope"></i>{user.email}</li>
                    <li><i className="bi bi-phone"></i>{user.phone}</li>
                    <li><i className="bi bi-calendar"></i>입사일 : {formatToKST(user.joined_at)}</li>
                    <li><i className="bi bi-coin"></i>시급 : ₩{user.salary}</li>
                  </ul>
                </div>

                <div className="btn">
                  <button onClick={() => {setEditUser(user); setShowEditPopup(true);}}>
                    <i className="bi bi-pencil-square"></i>편집
                  </button>
                  <button onClick={() => handleRemove(user.id)}>
                    <i className="bi bi-trash3"></i>삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 팝업 */}
        {showAddPopup && (
          <AddUserPopup
            onClose={() => setShowAddPopup(false)}
            onAdd={handleAddUser}
            isEdit={false}
          />
        )}

        {/* 수정 팝업 */}
        {showEditPopup && editUser && (
          <AddUserPopup
            onClose={() => setShowEditPopup(false)}
            onAdd={handleEditUser}
            user={editUser}
            isEdit={true}
          />
        )}
      </div>
    </div>
  )
};

export default UserManage;