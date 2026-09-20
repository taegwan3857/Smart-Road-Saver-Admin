import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from "../components/common/CustomSelect";
import { detectionService } from '../services/detectionService';
import { getAddressFromCoords } from '../utils/geocoder';
import Modal from '../components/common/Modal';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const formatEventId = (id) => {
  if (!id) return "-";
  if (typeof id === "number" || /^\d+$/.test(id)) return `EVT-${String(id).padStart(3, "0")}`;
  return id;
};


  const translateType = (type) => {
    if (!type) return '-';
    const t = String(type).toUpperCase();
    if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
    if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
    if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
    if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
    if (t.includes('WET_ROAD') || t.includes('젖은')) return '젖은 노면';
    return type;
  };

export default function DetectionList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [addresses, setAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(d => d.event_id||d.detection_id||d.id||d._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [periodFilter, setPeriodFilter] = useState('전체 기간');
  const [typeFilter, setTypeFilter] = useState('위험 유형 전체');
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await detectionService.getDetections();
        const fetchedItems = Array.isArray(data) ? data : (data?.data || data?.detections || data?.items || []);
        setItems(fetchedItems);
        for (const d of fetchedItems) {
          const id = d.event_id||d.detection_id||d.id||d._id;
          
          setAddresses(prev => {
            if (prev[id]) return prev;
            
            const fetchAddr = async () => {
              try {
                let finalAddr = '주소 정보 없음';
                const addr = d.address || d.location || d.road_address || d.address_name;
                if (addr && addr !== 'null' && !/GPS/i.test(addr) && !/POINT/i.test(addr)) {
                  let str = addr.replace(/^대한민국\s+/, '');
                  finalAddr = str;
                } else if (d.latitude && d.longitude) {
                  finalAddr = await getAddressFromCoords(d.latitude, d.longitude) || '주소 정보 없음';
                }
                setAddresses(curr => ({ ...curr, [id]: finalAddr }));
              } catch (e) {
                console.warn(e);
              }
            };
            fetchAddr();
            return { ...prev, [id]: '도로명 주소 변환 중...' };
          });
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const getBadgeClass = (confidence) => {
    const c = Number(confidence);
    if (c >= 80) return 'high';
    if (c >= 50) return 'medium';
    return 'low';
  };
  const getBadgeLabel = (confidence) => {
    const c = Number(confidence);
    if (c >= 80) return `위험 (${c}%)`;
    if (c >= 50) return `주의 (${c}%)`;
    return `낮음 (${c}%)`;
  };
  
  const getRiskLabel = (rl) => {
    const r = (rl||'').toUpperCase();
    if(r==='LOW') return '낮음';
    return '높음';
  };
  const getRiskColor = (rl) => {
    const r = (rl||'').toUpperCase();
    if(r==='LOW') return '#eab308';
    return '#ef4444';
  };

  const getStatusBadge = (status) => {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('confirmed')||s.includes('완료')) return 'low';
    if (s.includes('reported')||s.includes('접수')||s.includes('신고')) return 'medium';
    return 'neutral';
  };
  const getStatusLabel = (status) => {
    if (!status) return '검토 대기';
    const s = status.toLowerCase();
    if (s.includes('confirmed')||s.includes('완료')) return '처리 완료';
    if (s.includes('reported')||s.includes('접수')||s.includes('신고')) return '신고 접수';
    if (s.includes('pending')||s.includes('대기')) return '검토 대기';
    return status;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredItems = items.filter(d => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const id = String(d.detection_id||d.id||d._id||'').toLowerCase();
      const type = String(d.obstacle_type||d.event_type||d.type||'').toLowerCase();
      const addr = String(d.address||d.location||'').toLowerCase();
      matchesSearch = id.includes(term) || type.includes(term) || addr.includes(term);
    }

    let matchesType = true;
    if (typeFilter !== '위험 유형 전체') {
      const type = String(d.obstacle_type||d.event_type||d.type||'');
      const translated = translateType(type);
      matchesType = translated.includes(typeFilter) || type.includes(typeFilter);
    }

    const rl = (d.risk_level || '').toUpperCase();
    const matchesRisk = riskFilter === '' || rl === riskFilter;

    let matchesPeriod = true;
    const dDateStr = d.last_detected_at || d.first_detected_at || d.detected_at || d.created_at;
    if (periodFilter !== '전체 기간' && dDateStr) {
      const date = new Date(dDateStr);
      const now = new Date();
      
      if (periodFilter.includes('오늘')) {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (date < today) matchesPeriod = false;
      }
      else if (periodFilter.includes('최근 1주일')) {
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) matchesPeriod = false;
      }
      else if (periodFilter.includes('최근 1개월')) {
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) matchesPeriod = false;
      }
    }

    return matchesSearch && matchesType && matchesPeriod && matchesRisk;
  });

  const handleExcelDownload = async () => {
    if (selectedIds.length === 0) {
      setIsExcelModalOpen(true);
      return;
    }
    const itemsToDownload = filteredItems.filter(item => {
      const id = item.event_id||item.detection_id||item.id||item._id;
      return selectedIds.includes(id);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('감지기록', { views: [{ showGridLines: false }] });

    // Set Column Widths first
    worksheet.getColumn(1).width = 18;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 45;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 10;

    // Row 1: Title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Smart Road Saver 위험 요소 통합 감지 기록';
    titleCell.font = { name: '맑은 고딕', size: 16, bold: true, color: { argb: 'FF1E293B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;
    
    // Row 2: Subtitle / date
    worksheet.mergeCells('A2:H2');
    const subTitleCell = worksheet.getCell('A2');
    subTitleCell.value = `추출 일시: ${new Date().toLocaleString('ko-KR')}`;
    subTitleCell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF64748B' } };
    subTitleCell.alignment = { vertical: 'middle', horizontal: 'right' };

    // Row 3: Empty
    worksheet.addRow([]); 

    // Row 4: Headers
    const headers = ['이벤트 ID', '감지 시간', '제보 차량', '유형', '위험도', '주소', '신뢰도', '누적 감지'];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' }
      };
      cell.font = { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FF334155' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thick', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'medium', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });

    // Add data
    itemsToDownload.forEach((d) => {
      const id = formatEventId(d.event_id||d.detection_id||d.id||d._id);
      const time = d.first_detected_at||d.detected_at||d.created_at ? new Date(d.first_detected_at||d.detected_at||d.created_at).toLocaleString("ko-KR") : "-";
      const vehicle = d.reported_vehicle||d.vehicle_number||"연결 장치";
      const type = translateType(d.obstacle_type||d.event_type||d.type);
      const risk = getRiskLabel(d.risk_level);
      const address = addresses[d.event_id||d.detection_id||d.id||d._id] || (d.latitude && d.longitude ? `${d.latitude}, ${d.longitude}` : "-");
      const conf = d.confidence ? `${d.confidence}%` : (d.score ? `${d.score}%` : "82%");
      const count = (d.cumulative_count || d.detection_count || d.count) ? `${d.cumulative_count || d.detection_count || d.count}회` : "1회";
      
      const row = worksheet.addRow([id, time, vehicle, type, risk, address, conf, count]);
      
      row.eachCell((cell, colNumber) => {
        cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF334155' } };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
        
        if (colNumber === 6) { // Address
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        
        if (colNumber === 5) { // Risk
          if (risk === '높음') cell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FFEF4444' } };
          else if (risk === '낮음') cell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FFEAB308' } };
        }
      });
      row.height = 24;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Smart_Road_Saver_감지기록_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">감지 기록</div>
        <div className="page-subtitle">현장 AI 단말기가 수집한 도로 위 모든 위험 요소 및 장애물 감지 내역을 조회합니다.</div>
      </div>

      <div className="panel">
        {/* Filters */}
        <div className="board-filters">
          <div className="filter-group">
            <CustomSelect options={["전체 기간", "오늘", "최근 1주일", "최근 1개월"]} value={periodFilter} onChange={setPeriodFilter} />
            <CustomSelect options={[
              { value: "위험 유형 전체", label: "위험 유형 전체" },
              { value: "블랙아이스", label: "블랙아이스", icon: "fas fa-snowflake" },
              { value: "포트홀", label: "포트홀", icon: "fas fa-road" },
              { value: "장애물", label: "장애물", icon: "fas fa-box-open" }
            ]} value={typeFilter} onChange={setTypeFilter} />
            <CustomSelect options={[
              { value: '', label: '위험도 전체' },
              { value: 'HIGH', label: '높음', color: '#ef4444' },
              { value: 'LOW', label: '낮음', color: '#eab308' }
            ]} value={riskFilter} onChange={setRiskFilter} />
            <div className="search-box">
              <input type="text" className="form-input" placeholder="감지 ID 또는 위치 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
              <CustomSelect 
              options={[
                { value: 10, label: '10개씩 보기' },
                { value: 15, label: '15개씩 보기' },
                { value: 30, label: '30개씩 보기' },
                { value: 50, label: '50개씩 보기' },
                { value: 100, label: '100개씩 보기' }
              ]} 
              value={itemsPerPage} 
              onChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }} 
              style={{ width: '130px' }}
            />
            </div>
          </div>
          <div className="filter-group">
            
            <button className="btn-outline" onClick={handleExcelDownload}><i className="fas fa-file-excel" style={{color:"#10b981"}}></i> 엑셀 다운로드</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length} /></th>
                <th>이벤트 ID</th>
                <th>감지 시간</th>
                <th>제보 차량</th>
                <th>유형</th>
                <th>위험도</th>
                <th>주소</th>
                <th>신뢰도</th>
                <th>누적 감지</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="9" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="9" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>감지 기록이 없습니다.</td></tr>
              ) : currentItems.map((d) => (
                <tr key={d.event_id||d.detection_id||d.id||d._id} onClick={()=>navigate(`/detections/${d.event_id||d.detection_id||d.id||d._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(d.event_id||d.detection_id||d.id||d._id)} onChange={(e) => handleSelectOne(e, d.event_id||d.detection_id||d.id||d._id)} /></td>
                  <td style={{fontWeight:"500"}}>{formatEventId(d.event_id||d.detection_id||d.id||d._id)}</td>
                  <td>{d.first_detected_at||d.detected_at||d.created_at ? new Date(d.first_detected_at||d.detected_at||d.created_at).toLocaleString('ko-KR') : '-'}</td>
                  <td>{d.reported_vehicle||d.vehicle_number||'연결 장치'}</td>
                  <td>{translateType(d.obstacle_type||d.event_type||d.type)}</td>
                  <td><span className="badge medium" style={{background: "transparent", color: getRiskColor(d.risk_level)}}>{getRiskLabel(d.risk_level)}</span></td>
                  <td>{addresses[d.event_id||d.detection_id||d.id||d._id] || (d.latitude && d.longitude ? `${d.latitude}, ${d.longitude}` : '-')}</td>
                  <td>{d.confidence ? `${d.confidence}%` : (d.score ? `${d.score}%` : '82%')}</td>
                  <td>{(d.cumulative_count || d.detection_count || d.count) ? `${d.cumulative_count || d.detection_count || d.count}회` : '1회'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
          <div className="board-pagination" style={{ margin: 0, marginTop: 0 }}>
          <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-double-left"></i></button>
          <button className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-left"></i></button>
          
          {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
            // Show up to 5 pages around the current page
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + 4);
            if (end - start < 4) start = Math.max(1, end - 4);
            const p = start + i;
            if (p > totalPages) return null;
            
            return (
              <button 
                key={p} 
                className={`page-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
                style={{cursor: 'pointer'}}
              >
                {p}
              </button>
            );
          })}
          
          <button className="page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{cursor: currentPage===totalPages?'default':'pointer', opacity: currentPage===totalPages?0.5:1}}><i className="fas fa-angle-right"></i></button>
          <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{cursor: currentPage===totalPages?'default':'pointer', opacity: currentPage===totalPages?0.5:1}}><i className="fas fa-angle-double-right"></i></button>
        </div>
        </div>
      </div>
      <Modal isOpen={isExcelModalOpen} title="알림" message="엑셀로 다운로드할 항목을 먼저 선택해주세요." confirmText="확인" onConfirm={() => setIsExcelModalOpen(false)} />
    </div>
  );
}
