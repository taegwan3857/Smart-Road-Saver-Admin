import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import CustomSelect from '../components/common/CustomSelect';

export default function UserList() {
  const navigate = useNavigate();
  
  // User State
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(user => user.user_id||user.id||user._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 사용자를 선택해주세요.");
      return;
    }
    if (!window.confirm(`선택한 사용자 ${selectedIds.length}명을 삭제하시겠습니까?`)) return;
    try {
      for (const id of selectedIds) {
        await userService.deleteUser(id);
      }
      alert("삭제되었습니다.");
      setSelectedIds([]);
      // Refresh list
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : (data?.users || data?.data || []));
    } catch (e) {
      console.error(e);
      alert("삭제 처리 중 오류가 발생했습니다.");
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchInput, setUserSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('권한 전체');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(Array.isArray(data) ? data : (data?.users || data?.items || []));
      } catch (err) { console.error('User fetch error:', err); }
      finally { setIsUsersLoading(false); }
    };
    
    fetchUsers();
  }, []);

  const handleUserSearch = () => setUserSearchTerm(userSearchInput);
  const handleUserKeyDown = (e) => { if (e.key === 'Enter') handleUserSearch(); };
  
  const filteredUsers = users.filter(user => {
    let matchesSearch = true;
    if (userSearchTerm) {
      const term = userSearchTerm.toLowerCase();
      const nm = String(user.name||'').toLowerCase();
      const id = String(user.login_id||user.userId||'').toLowerCase();
      matchesSearch = nm.includes(term) || id.includes(term);
    }
    let matchesRole = true;
    if (roleFilter !== '권한 전체') {
      const roleStr = String(user.role||'');
      const isUser = roleStr.toLowerCase() === 'driver' || roleStr.includes('관제') || roleStr === '사용자';
      const displayRole = isUser ? '사용자' : '관리자';
      matchesRole = displayRole === roleFilter;
    }
    return matchesSearch && matchesRole;
  });

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">사용자 관리</div>
        <div className="page-subtitle">시스템 관리자 계정과 현장 사용자(관제 차량, AI 단말기 연동) 정보를 통합하여 관리합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
            <div className="filter-group">
              <CustomSelect 
                options={["권한 전체", "관리자", "사용자"]} 
                value={roleFilter} 
                onChange={setRoleFilter} 
              />
              <div className="search-box">
                <input type="text" className="form-input" placeholder="이름, 아이디 검색" value={userSearchInput} onChange={(e) => setUserSearchInput(e.target.value)} onKeyDown={handleUserKeyDown} />
                <button className="btn-primary" onClick={handleUserSearch}>검색</button>
              </div>
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
              <button className="btn-secondary" style={{borderColor:"#ef4444", color:"#ef4444", background:"white", padding:"8px 16px", borderRadius:"6px", cursor:"pointer", fontWeight:"600"}} onClick={handleDeleteSelected}>
                <i className="fas fa-trash-alt" style={{marginRight:"6px"}}></i>삭제
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length} /></th>
                <th>아이디</th>
                <th>이름</th>
                <th>권한 등급</th>
                <th>연락처</th>
              </tr>
            </thead>
            <tbody>
              {isUsersLoading ? (
                <tr><td colSpan="5" style={{textAlign:"center",padding:"20px",color:"#94a3b8"}}></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign:"center",padding:"20px",color:"#94a3b8"}}>검색 결과가 없습니다.</td></tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const roleStr = String(user.role||'');
                  const isUser = roleStr.toLowerCase() === 'driver' || roleStr.includes('관제') || roleStr === '사용자';
                  const displayRole = isUser ? '사용자' : '관리자';
                  const badgeClass = isUser ? 'medium' : 'high';

                  return (
                    <tr key={user.user_id||user.id||user._id||idx} onClick={() => navigate(`/users/${user.user_id||user.id||user._id}`)} style={{cursor: "pointer"}}>
                      <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(user.user_id||user.id||user._id)} onChange={(e) => handleSelectOne(e, user.user_id||user.id||user._id)} /></td>
                      <td style={{fontWeight: "500"}}>{user.login_id||user.userId||'-'}</td>
                      <td>{user.name||'-'}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>
                          {displayRole}
                        </span>
                      </td>
                      <td>{user.phone||user.phone_number||'-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
