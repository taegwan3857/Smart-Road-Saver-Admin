import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import CustomSelect from '../components/common/CustomSelect';
import Modal from '../components/common/Modal';

export default function UserList() {
  const navigate = useNavigate();
  
  // User State
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const confirmDelete = () => {
    if (selectedIds.length === 0) {
      setAlertModal({ isOpen: true, title: "알림", message: "삭제할 사용자를 선택해주세요.", type: "info" });
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(user => user.user_id||user.id||user._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleteModalOpen(false);
    try {
      for (const id of selectedIds) {
        await userService.deleteUser(id);
      }
      setAlertModal({ isOpen: true, title: "삭제 완료", message: "선택한 사용자가 삭제되었습니다.", type: "info" });
      setSelectedIds([]);
      // Refresh list
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : (data?.users || data?.data || []));
    } catch (e) {
      console.error(e);
      setAlertModal({ isOpen: true, title: "오류", message: "삭제 처리 중 오류가 발생했습니다.", type: "danger" });
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
        let fetchedUsers = Array.isArray(data) ? data : (data?.users || data?.items || []);
        
        // 실제 DB에 관리자 계정 생성 (없는 경우)
        const hasRealAdmin = fetchedUsers.some(u => u.login_id === 'admin' || u.email === 'mars@dongyang.ac.kr');
        if (!hasRealAdmin) {
          try {
            const apiClient = (await import('../api/client')).default;
            await apiClient.post('/api/users', {
              login_id: 'admin',
              password: 'password123',
              name: 'S.R.S.관리자',
              email: 'mars@dongyang.ac.kr',
              phone: '010-7182-6783',
              role: 'ADMIN',
              status: '정상 (Active)'
            });
            // 생성 후 리스트 다시 불러오기
            const newData = await userService.getUsers();
            fetchedUsers = Array.isArray(newData) ? newData : (newData?.users || newData?.items || []);
          } catch (e) {
            console.error('Failed to create real admin:', e);
          }
        }
        setUsers(fetchedUsers);
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
        <div className="page-subtitle">관리자 계정과 사용자 계정 정보를 통합하여 관리합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div className="filter-group" style={{display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
              <CustomSelect 
                options={["권한 전체", "관리자", "사용자"]} 
                value={roleFilter} 
                onChange={setRoleFilter} 
              />
              <div className="search-box">
                <input type="text" className="form-input" placeholder="이름, 아이디 검색" value={userSearchInput} onChange={(e) => setUserSearchInput(e.target.value)} onKeyDown={handleUserKeyDown} />
                <button className="btn-primary" onClick={handleUserSearch}>검색</button>
              </div>
              
              <button className="btn-outline" style={{marginLeft: "auto"}} onClick={confirmDelete}>
                <i className="fas fa-trash-alt" style={{color:"#ef4444", marginRight:"6px"}}></i> 선택 삭제
              </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length} /></th>
                <th>아이디</th>
                <th>이름</th>
                <th>권한</th>
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
                      <td>{user.login_id||user.userId||'-'}</td>
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

      <Modal 
        isOpen={isDeleteModalOpen}
        title="사용자 삭제"
        message={`선택한 사용자 ${selectedIds.length}명을 삭제하시겠습니까?`}
        type="danger"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteSelected}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      
      <Modal 
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={null}
      />
    </div>
  );
}
