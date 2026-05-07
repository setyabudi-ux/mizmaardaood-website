// Data Peserta dan Evaluasi
let participants = [
    {
        id: 1,
        name: "Aisyah Putri",
        level: "Mahir",
        joinDate: "2024-01-15",
        avatar: "A",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 95, tanggal: "2024-01-30" },
            { materi: "Tahsin Al-Qur'an", nilai: 88, tanggal: "2024-02-15" },
            { materi: "Hafalan Juz 30", nilai: 92, tanggal: "2024-03-01" }
        ]
    },
    {
        id: 2,
        name: "Muhammad Rizki",
        level: "Lanjutan",
        joinDate: "2024-01-20",
        avatar: "M",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 85, tanggal: "2024-02-01" },
            { materi: "Tahsin Al-Qur'an", nilai: 90, tanggal: "2024-02-20" }
        ]
    },
    {
        id: 3,
        name: "Fatimah Zahra",
        level: "Mahir",
        joinDate: "2023-12-01",
        avatar: "F",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 98, tanggal: "2023-12-15" },
            { materi: "Tahsin Al-Qur'an", nilai: 96, tanggal: "2024-01-10" },
            { materi: "Hafalan Juz 30", nilai: 94, tanggal: "2024-02-20" }
        ]
    },
    {
        id: 4,
        name: "Ahmad Hasan",
        level: "Pemula",
        joinDate: "2024-02-10",
        avatar: "A",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 75, tanggal: "2024-02-28" }
        ]
    },
    {
        id: 5,
        name: "Siti Nurhaliza",
        level: "Lanjutan",
        joinDate: "2024-01-05",
        avatar: "S",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 92, tanggal: "2024-01-25" },
            { materi: "Tahsin Al-Qur'an", nilai: 85, tanggal: "2024-02-15" }
        ]
    },
    {
        id: 6,
        name: "Umar Faruq",
        level: "Mahir",
        joinDate: "2023-11-10",
        avatar: "U",
        evaluations: [
            { materi: "Tajwid Dasar", nilai: 97, tanggal: "2023-11-30" },
            { materi: "Tahsin Al-Qur'an", nilai: 95, tanggal: "2023-12-20" },
            { materi: "Hafalan Juz 30", nilai: 96, tanggal: "2024-01-15" }
        ]
    }
];

let totalMateri = 3; // Tajwid, Tahsin, Hafalan
let nextId = 7;

// Load data dari localStorage
function loadData() {
    const saved = localStorage.getItem('mizmaardaood_data');
    if (saved) {
        const data = JSON.parse(saved);
        participants = data.participants;
        nextId = data.nextId;
    }
    updateStats();
    renderParticipants();
    renderRanking();
    updateAdminSelect();
}

// Save data ke localStorage
function saveData() {
    localStorage.setItem('mizmaardaood_data', JSON.stringify({
        participants: participants,
        nextId: nextId
    }));
}

// Update statistik
function updateStats() {
    document.getElementById('statPeserta').textContent = participants.length;
    document.getElementById('statMateri').textContent = totalMateri;
    
    let totalPencapaian = 0;
    participants.forEach(p => {
        totalPencapaian += p.evaluations.length;
    });
    document.getElementById('statPencapaian').textContent = totalPencapaian;
}

// Render daftar peserta
function renderParticipants() {
    const searchText = document.getElementById('searchPeserta')?.value.toLowerCase() || '';
    const filterLevel = document.getElementById('filterLevel')?.value || 'all';
    
    let filtered = participants.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchText);
        const matchLevel = filterLevel === 'all' || p.level === filterLevel;
        return matchSearch && matchLevel;
    });
    
    const container = document.getElementById('participantsGrid');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">Tidak ada peserta ditemukan</div>';
        return;
    }
    
    container.innerHTML = filtered.map(participant => `
        <div class="participant-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all" onclick="showParticipantDetail(${participant.id})">
            <div class="bg-gradient-to-r from-emerald-500 to-emerald-700 p-4 text-white">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-emerald-dark mx-auto">
                    ${participant.avatar}
                </div>
            </div>
            <div class="p-4 text-center">
                <h3 class="font-bold text-lg mb-1">${participant.name}</h3>
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(participant.level)}">
                    ${participant.level}
                </span>
                <div class="mt-3">
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-star text-gold"></i> ${participant.evaluations.length} Pencapaian
                    </div>
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-calendar"></i> ${formatDate(participant.joinDate)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get level color
function getLevelColor(level) {
    switch(level) {
        case 'Mahir': return 'bg-gold text-gray-900';
        case 'Lanjutan': return 'bg-emerald-100 text-emerald-dark';
        default: return 'bg-blue-100 text-blue-800';
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Show participant detail (evaluasi & pencapaian)
function showParticipantDetail(id) {
    const participant = participants.find(p => p.id === id);
    if (!participant) return;
    
    const totalNilai = participant.evaluations.reduce((sum, e) => sum + e.nilai, 0);
    const rataNilai = participant.evaluations.length > 0 ? (totalNilai / participant.evaluations.length).toFixed(1) : 0;
    const progress = (participant.evaluations.length / totalMateri) * 100;
    
    const modalContent = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="closeDetailModal(event)">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" onclick="event.stopPropagation()">
                <div class="sticky top-0 bg-gradient-to-r from-emerald-700 to-blue-800 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">${participant.name}</h2>
                        <p class="text-emerald-200">Bergabung: ${formatDate(participant.joinDate)}</p>
                    </div>
                    <button onclick="closeDetailModal()" class="text-3xl hover:text-gray-300">&times;</button>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-emerald-50 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-emerald-dark">${participant.level}</div>
                            <div class="text-sm text-gray-600">Level Membaca</div>
                        </div>
                        <div class="bg-gold bg-opacity-20 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-gold-dark">${rataNilai}</div>
                            <div class="text-sm text-gray-600">Rata-rata Nilai</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-blue-600">${participant.evaluations.length}</div>
                            <div class="text-sm text-gray-600">Materi Selesai</div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-bold text-lg mb-3">📊 Progres Belajar</h3>
                        <div class="bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div class="progress-bar bg-gradient-to-r from-emerald-500 to-emerald-700 h-full rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <p class="text-right text-sm text-gray-600 mt-1">${progress.toFixed(0)}% Complete</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-bold text-lg mb-3">📝 Daftar Evaluasi & Nilai</h3>
                        <div class="space-y-3">
                            ${participant.evaluations.map(evalItem => `
                                <div class="border rounded-lg p-4 hover:shadow-md transition">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h4 class="font-semibold">${evalItem.materi}</h4>
                                            <p class="text-sm text-gray-500">${formatDate(evalItem.tanggal)}</p>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-2xl font-bold ${evalItem.nilai >= 90 ? 'text-emerald-dark' : evalItem.nilai >= 75 ? 'text-gold-dark' : 'text-red-500'}">
                                                ${evalItem.nilai}
                                            </div>
                                            <div class="text-xs text-gray-500">/ 100</div>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <div class="flex flex-wrap gap-2">
                                            <span class="badge-gold inline-block px-2 py-1 rounded-full text-xs text-white">
                                                <i class="fas fa-certificate"></i> Sertifikat
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${participant.evaluations.length === 0 ? '<p class="text-gray-500 text-center py-4">Belum ada evaluasi</p>' : ''}
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="printEvaluation(${participant.id})" class="bg-emerald-dark text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                            <i class="fas fa-print"></i> Cetak Laporan
                        </button>
                        <button onclick="closeDetailModal()" class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('detailModal');
    if (existingModal) existingModal.remove();
    
    const modalDiv = document.createElement('div');
    modalDiv.id = 'detailModal';
    modalDiv.innerHTML = modalContent;
    document.body.appendChild(modalDiv);
}

// Close detail modal
function closeDetailModal(event) {
    const modal = document.getElementById('detailModal');
    if (modal) modal.remove();
}

// Print evaluation
function printEvaluation(id) {
    const participant = participants.find(p => p.id === id);
    if (!participant) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Laporan Evaluasi - ${participant.name}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #047857; color: white; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MizmaarDaood Learning Center</h1>
                <h2>Laporan Evaluasi Peserta</h2>
            </div>
            <div class="info">
                <p><strong>Nama:</strong> ${participant.name}</p>
                <p><strong>Level:</strong> ${participant.level}</p>
                <p><strong>Tanggal Bergabung:</strong> ${formatDate(participant.joinDate)}</p>
            </div>
            <table>
                <thead>
                    <tr><th>Materi</th><th>Nilai</th><th>Tanggal</th></tr>
                </thead>
                <tbody>
                    ${participant.evaluations.map(e => `<tr><td>${e.materi}</td><td>${e.nilai}</td><td>${formatDate(e.tanggal)}</td></tr>`).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID')}</p>
                <p>&copy; MizmaarDaood - Belajar Al-Qur'an dengan Cinta</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Render ranking
function renderRanking() {
    const ranking = [...participants].sort((a, b) => {
        const avgA = a.evaluations.length ? a.evaluations.reduce((s, e) => s + e.nilai, 0) / a.evaluations.length : 0;
        const avgB = b.evaluations.length ? b.evaluations.reduce((s, e) => s + e.nilai, 0) / b.evaluations.length : 0;
        return avgB - avgA;
    }).slice(0, 5);
    
    const container = document.getElementById('rankingList');
    if (!container) return;
    
    container.innerHTML = ranking.map((p, index) => {
        const avgNilai = p.evaluations.length ? (p.evaluations.reduce((s, e) => s + e.nilai, 0) / p.evaluations.length).toFixed(1) : 0;
        return `
            <div class="bg-white rounded-lg p-4 mb-3 shadow-md hover:shadow-lg transition flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-gold-dark flex items-center justify-center text-white font-bold text-xl">
                        ${index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}
                    </div>
                    <div>
                        <h4 class="font-bold">${p.name}</h4>
                        <p class="text-sm text-gray-600">${p.level}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-emerald-dark">${avgNilai}</div>
                    <div class="text-xs text-gray-500">Rata-rata nilai</div>
                </div>
            </div>
        `;
    }).join('');
}

// Admin functions
function openAdminModal() {
    const password = prompt("Masukkan password admin:");
    if (password === "quran123") {
        document.getElementById('adminModal').classList.remove('hidden');
        updateAdminSelect();
        renderAdminList();
    } else if (password !== null) {
        alert("Password salah!");
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function updateAdminSelect() {
    const select = document.getElementById('evalParticipant');
    if (select) {
        select.innerHTML = participants.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
}

function renderAdminList() {
    const container = document.getElementById('adminParticipantList');
    if (!container) return;
    
    container.innerHTML = participants.map(p => `
        <div class="border rounded p-3 flex justify-between items-center">
            <div>
                <strong>${p.name}</strong> - ${p.level}
                <div class="text-sm text-gray-500">${p.evaluations.length} evaluasi</div>
            </div>
            <div>
                <button onclick="deleteParticipant(${p.id})" class="text-red-500 hover:text-red-700 mr-2">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="editParticipant(${p.id})" class="text-blue-500 hover:text-blue-700">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function addParticipant() {
    const name = document.getElementById('newName').value.trim();
    const level = document.getElementById('newLevel').value;
    
    if (!name) {
        alert("Nama peserta harus diisi!");
        return;
    }
    
    const newParticipant = {
        id: nextId++,
        name: name,
        level: level,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: name.charAt(0).toUpperCase(),
        evaluations: []
    };
    
    participants.push(newParticipant);
    saveData();
    loadData();
    document.getElementById('newName').value = '';
    renderAdminList();
    alert("Peserta berhasil ditambahkan!");
}

function deleteParticipant(id) {
    if (confirm("Yakin ingin menghapus peserta ini?")) {
        participants = participants.filter(p => p.id !== id);
        saveData();
        loadData();
        renderAdminList();
    }
}

function editParticipant(id) {
    const participant = participants.find(p => p.id === id);
    if (!participant) return;
    
    const newName = prompt("Edit nama:", participant.name);
    if (newName && newName.trim()) {
        participant.name = newName.trim();
        participant.avatar = newName.charAt(0).toUpperCase();
        saveData();
        loadData();
        renderAdminList();
    }
}

function addEvaluation() {
    const participantId = parseInt(document.getElementById('evalParticipant').value);
    const materi = document.getElementById('evalMateri').value.trim();
    const nilai = parseInt(document.getElementById('evalNilai').value);
    
    if (!materi) {
        alert("Nama materi harus diisi!");
        return;
    }
    
    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        alert("Nilai harus antara 0-100!");
        return;
    }
    
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
        participant.evaluations.push({
            materi: materi,
            nilai: nilai,
            tanggal: new Date().toISOString().split('T')[0]
        });
        saveData();
        loadData();
        document.getElementById('evalMateri').value = '';
        document.getElementById('evalNilai').value = '';
        alert("Evaluasi berhasil ditambahkan!");
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    if (document.getElementById('searchPeserta')) {
        document.getElementById('searchPeserta').addEventListener('input', () => renderParticipants());
    }
    
    if (document.getElementById('filterLevel')) {
        document.getElementById('filterLevel').addEventListener('change', () => renderParticipants());
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.onclick = openAdminModal;
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = () => {
            alert("Silakan akses menggunakan desktop untuk pengalaman terbaik!");
        };
    }
});
