import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar, Activity, Plus, Trash2, 
  CheckCircle, Clock, Sun, Moon, Dumbbell, Award, 
  Lightbulb, RefreshCw, BarChart2, Eye, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// --- DATA MOTIVASI & REKOMENDASI ---
const QUOTES = [
  "Kesehatan adalah amanah, jagalah ia dengan olahraga yang teratur dan niat yang ikhlas.",
  "Jangan melihat seberapa berat latihannya, lihatlah dampak baiknya bagi tubuhmu di masa depan.",
  "Disiplin adalah jembatan antara target dan pencapaian nyata.",
  "Langkah kecil yang konsisten jauh lebih baik daripada lompatan besar yang hanya sekali dilakukan.",
  "Kekuatan tidak datang dari kemampuan fisik, tetapi dari kemauan yang tidak pernah menyerah."
];

// Database gambar animasi gerakan (menggunakan open-source fitness ilustrasi)
const IMAGE_GUIDES = {
  "push-up": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60", // Ilustrasi olahraga posisi push up
  "squat": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60", // Ilustrasi squat/kaki
  "plank": "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=500&auto=format&fit=crop&q=60", // Ilustrasi ketahanan core
  "jalan": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=60", // Ilustrasi jalan kaki/jogging
  "default": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60"
};

const REKOMENDASI_LATIHAN = [
  { name: "Push-Up Dasar", time: "07:00", target: 3, color: "#15803d", type: "push-up", desc: "Bagus untuk melatih otot dada, bahu, dan lengan atas. Jaga posisi tubuh tetap lurus." },
  { name: "Plank Stabilisasi", time: "06:30", target: 4, color: "#0ea5e9", type: "plank", desc: "Memperkuat otot inti (core), perut, dan memperbaiki postur tulang belakang." },
  { name: "Squats Pemula", time: "16:00", target: 3, color: "#eab308", type: "squat", desc: "Melatih kekuatan otot paha, bokong, dan meningkatkan metabolisme tubuh." },
  { name: "Jalan Cepat / Jogging", time: "16:30", target: 5, color: "#a855f7", type: "jalan", desc: "Menjaga kesehatan kardiovaskular (jantung) dan efektif membakar kalori bulanan." }
];

// --- JADWAL BAWAAN UNTUK 1 BULAN ---
const JADWAL_DEFAULT = [
  { id: 1, name: "Push-Up Pemula", time: "06:30", target: 3, color: "#15803d", type: "push-up" },
  { id: 2, name: "Squats & Lunges", time: "07:00", target: 3, color: "#eab308", type: "squat" },
  { id: 3, name: "Plank Tahanan Core", time: "17:00", target: 4, color: "#0ea5e9", type: "plank" },
  { id: 4, name: "Jalan Kaki Sehat", time: "16:00", target: 5, color: "#a855f7", type: "jalan" }
];

const KATEGORI_WARNA = [
  { name: 'Hijau Zamrud', value: '#15803d' },
  { name: 'Emas', value: '#eab308' },
  { name: 'Biru Laut', value: '#0ea5e9' },
  { name: 'Ungu Elegan', value: '#a855f7' },
  { name: 'Abu Stone', value: '#57534e' }
];

const App = () => {
  // --- STATE MANAGEMENT ---
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('hf_premium_workouts');
    return saved ? JSON.parse(saved) : JADWAL_DEFAULT;
  });
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('hf_premium_logs');
    return saved ? JSON.parse(saved) : {};
  });
  const [showForm, setShowForm] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  
  // State untuk Pop-up Gambar Panduan Visual
  const [modalImage, setModalImage] = useState(null);

  // --- LOCAL STORAGE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('hf_premium_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('hf_premium_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // --- FITUR INTERAKSI ---
  const toggleCheck = (workoutId) => {
    const currentLogs = logs[todayStr] || [];
    let newLogs = currentLogs.includes(workoutId)
      ? currentLogs.filter(id => id !== workoutId)
      : [...currentLogs, workoutId];
    setLogs({ ...logs, [todayStr]: newLogs });
  };

  const addWorkout = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const exerciseName = formData.get('name').toLowerCase();
    
    // Deteksi tipe gerakan untuk mencocokkan gambar panduan
    let detectedType = "default";
    if (exerciseName.includes("push")) detectedType = "push-up";
    else if (exerciseName.includes("squat")) detectedType = "squat";
    else if (exerciseName.includes("plank")) detectedType = "plank";
    else if (exerciseName.includes("jalan") || exerciseName.includes("jog")) detectedType = "jalan";

    const newWorkout = {
      id: Date.now(),
      name: formData.get('name'),
      time: formData.get('time'),
      target: parseInt(formData.get('target')) || 1,
      color: formData.get('color'),
      type: detectedType
    };
    setWorkouts([...workouts, newWorkout]);
    setShowForm(false);
  };

  const klaimRekomendasi = (rec) => {
    const isExist = workouts.some(w => w.name.toLowerCase() === rec.name.toLowerCase());
    if (isExist) {
      alert("Latihan ini sudah ada di jadwal Anda!");
      return;
    }
    const newWorkout = {
      id: Date.now(),
      name: rec.name,
      time: rec.time,
      target: rec.target,
      color: rec.color,
      type: rec.type
    };
    setWorkouts([...workouts, newWorkout]);
    alert(`Berhasil menambahkan "${rec.name}" ke jadwal latihan bulanan Anda!`);
  };

  const deleteWorkout = (id) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus jadwal latihan ini?")) {
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  const resetKeJadwalDefault = () => {
    if(window.confirm("Kembalikan semua jadwal ke pengaturan latihan default 1 bulan?")) {
      setWorkouts(JADWAL_DEFAULT);
    }
  };

  const bukaPanduanGambar = (type, title) => {
    const imgUrl = IMAGE_GUIDES[type] || IMAGE_GUIDES["default"];
    setModalImage({ url: imgUrl, title: title });
  };

  // --- HITUNG PERSENTASE & STATISTIK ---
  const stats = useMemo(() => {
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const currentMonthLogs = Object.entries(logs).filter(([date]) => date.startsWith(currentMonthStr));
    const totalCompleted = currentMonthLogs.reduce((acc, [, ids]) => acc + ids.length, 0);
    const totalTarget = workouts.reduce((acc, w) => acc + (w.target * 4), 0); 
    const percentage = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (logs[dStr] && logs[dStr].length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const chartData = [];
    for(let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 7));
      let weekTotal = 0;
      for(let j = 0; j < 7; j++) {
        const tempDate = new Date(d);
        tempDate.setDate(d.getDate() + j);
        const tStr = tempDate.toISOString().split('T')[0];
        if(logs[tStr]) weekTotal += logs[tStr].length;
      }
      chartData.push({ name: `Minggu ${4-i}`, Selesai: weekTotal });
    }

    return { totalCompleted, totalTarget, percentage, streak, chartData };
  }, [workouts, logs]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-600 dark:text-emerald-400" size={28} />
          <h1 className="text-xl font-bold tracking-wide text-emerald-700 dark:text-emerald-400">
            Hijrah<span className="text-gray-800 dark:text-white">Fit Pro</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>
        </div>
      </header>

      {/* CONTAINER UTAMA */}
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* BANNER MOTIVASI & ILUSTRASI */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 mb-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xs font-semibold opacity-75 uppercase tracking-wider">Nasihat Hari Ini</h2>
            <p className="text-xl md:text-2xl font-bold">"{quote}"</p>
          </div>
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <Dumbbell size={44} className="text-emerald-200 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SIDEBAR PANEL KIRI */}
          <div className="md:col-span-1 space-y-4">
            <nav className="bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dasbor Utama' },
                { id: 'jadwal', icon: Calendar, label: 'Ubah Jadwal Bulanan' },
                { id: 'rekomendasi', icon: Lightbulb, label: 'Usulan & Gambar' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CARD PERSENTASE OTOMATIS */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <Award className="mx-auto text-yellow-500 mb-2" size={36} />
              <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Total Capaian Bulanan</h3>
              <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 my-2">{stats.percentage}%</div>
              
              <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500" 
                  style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-100 dark:border-slate-700 pt-3">
                <div className="border-r border-gray-100 dark:border-slate-700">
                  <span className="block text-gray-400">Selesai</span>
                  <strong className="text-sm text-gray-700 dark:text-gray-200">{stats.totalCompleted}x</strong>
                </div>
                <div>
                  <span className="block text-gray-400">Streak Aktif</span>
                  <strong className="text-sm text-orange-500">{stats.streak} Hari 🔥</strong>
                </div>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA SEBELAH KANAN */}
          <div className="md:col-span-2 space-y-6">
            
            {/* TAB 1: DASBOR UTAMA */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Latihan Hari Ini</h2>
                    <p className="text-xs text-gray-400">Centang latihan dan gunakan panduan mata jika lupa gerakannya</p>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">{todayStr}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {workouts.map((workout) => {
                    const isCompleted = (logs[todayStr] || []).includes(workout.id);
                    return (
                      <div 
                        key={workout.id} 
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex justify-between items-center border-l-4 transition hover:shadow"
                        style={{ borderLeftColor: workout.color }}
                      >
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleCheck(workout.id)} className="focus:outline-none">
                            <CheckCircle size={32} className={`transition-all ${isCompleted ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-900' : 'text-gray-300 hover:text-emerald-500'}`} />
                          </button>
                          <div>
                            <h4 className={`font-bold text-base ${isCompleted ? 'line-through text-gray-400' : ''}`}>{workout.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1"><Clock size={12} /> {workout.time}</span>
                              <span>• Target Sebulan: {workout.target * 4}x</span>
                            </div>
                          </div>
                        </div>

                        {/* Tombol Kamera/Mata Panduan Visual */}
                        <button 
                          onClick={() => bukaPanduanGambar(workout.type, workout.name)}
                          className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition"
                        >
                          <Eye size={14} /> <span className="hidden sm:inline">Panduan</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: UBAH JADWAL BULANAN */}
            {activeTab === 'jadwal' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <h2 className="text-xl font-bold">Modifikasi Rencana Latihan</h2>
                    <p className="text-xs text-gray-400">Atur ulang atau tambah target frekuensi bulanan Anda</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetKeJadwalDefault} className="flex items-center gap-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-xs font-medium transition"><RefreshCw size={14} /> Reset Default</button>
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition shadow-sm"><Plus size={14} /> Tambah Jadwal</button>
                  </div>
                </div>

                {showForm && (
                  <form onSubmit={addWorkout} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4 shadow-md">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Latihan Baru</label>
                      <input name="name" type="text" placeholder="Contoh: Push Up Kursi, Plank Siku" required className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Jam Latihan</label>
                        <input name="time" type="time" required className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Target Mingguan</label>
                        <input name="target" type="number" min="1" max="7" placeholder="Frekuensi" required className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Warna Label</label>
                      <select name="color" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                        {KATEGORI_WARNA.map(k => <option key={k.value} value={k.value}>{k.name}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs">Batal</button>
                      <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700">Simpan Jadwal</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {workouts.map(w => (
                    <div key={w.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-gray-100 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: w.color }} />
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-gray-100">{w.name}</h4>
                          <p className="text-xs text-gray-400">Pukul {w.time} • Target {w.target * 4}x sebulan</p>
                        </div>
                      </div>
                      <button onClick={() => deleteWorkout(w.id)} className="text-red-400 hover:text-red-500 p-2 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: USULAN & REKOMENDASI JADWAL */}
            {activeTab === 'rekomendasi' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">Rekomendasi Gerakan Teruji</h2>
                  <p className="text-xs text-gray-400">Klik tombol gambar untuk melihat ilustrasi peragaan postur tubuh sebelum memulai latihan</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REKOMENDASI_LATIHAN.map((rec, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between space-y-4 shadow-sm">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rec.color }} />
                            <h4 className="font-bold text-base text-gray-800 dark:text-gray-100">{rec.name}</h4>
                          </div>
                          <button 
                            onClick={() => bukaPanduanGambar(rec.type, rec.name)}
                            className="text-emerald-600 dark:text-emerald-400 hover:scale-110 transition"
                            title="Lihat Gambar"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{rec.desc}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-50 dark:border-slate-700/50 flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-medium">Saran: {rec.target}x seminggu</span>
                        <button onClick={() => klaimRekomendasi(rec)} className="bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg transition">+ Ambil Usulan</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* VISUALISASI GRAFIK */}
                <div className="pt-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><BarChart2 size={16} /> Analisis Performa Mingguan</h3>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
                        <Bar dataKey="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* --- POP-UP MODAL GAMBAL PANDUAN VISUAL --- */}
      {modalImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full overflow-hidden p-5 shadow-2xl border border-gray-100 dark:border-slate-700 relative">
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Dumbbell size={18} className="text-emerald-500" /> {modalImage.title}
              </h3>
              <button 
                onClick={() => setModalImage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Kotak Gambar Peragaan Gerakan */}
            <div className="bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 flex items-center justify-center aspect-video shadow-inner">
              <img 
                src={modalImage.url} 
                alt={modalImage.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = IMAGE_GUIDES['default']; }}
              />
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              *Pastikan punggung tegak dan lakukan gerakan secara perlahan dengan nafas teratur.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
import React from 'react';

function App() {
  // Fungsi untuk membuat website berbicara
  const bersuara = (teks) => {
    const ucapan = new window.SpeechSynthesisUtterance();
    ucapan.text = teks;
    ucapan.lang = 'id-ID'; // Menggunakan suara bahasa Indonesia
    window.speechSynthesis.speak(ucapan);
  };

  // Gaya tampilan (Warna Bagus & Gradien Modern)
  const gayaContainer = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradien Ungu Biru yang estetis
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px'
  };

  const gayaTombolInsta = {
    marginTop: '20px',
    padding: '14px 30px',
    backgroundColor: '#E1306C', // Warna resmi Instagram
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: '0.3s'
  };

  return (
    <div style={gayaContainer}>
      {/* Judul akan berbicara saat halaman pertama kali diklik atau saat judul disentuh */}
      <h1 
        style={{ cursor: 'pointer', fontSize: '2.5rem', marginBottom: '10px' }} 
        onClick={() => bersuara("Selamat datang di Hijrah Fit Pro")}
      >
        HijrahFit Pro 🚀
      </h1>
      
      <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
        Klik judul di atas untuk mendengar suara, atau klik tombol di bawah untuk ke Instagram saya!
      </p>

      {/* Tombol yang langsung menghantarkan ke Instagram habibi_nofa */}
      <button 
        style={gayaTombolInsta}
        onClick={() => {
          bersuara("Membuka Instagram Hasan");
          window.open('https://www.instagram.com/habibi_nofa', '_blank');
        }}
      >
        Kunjungi Instagram Saya
      </button>
    </div>
  );
}

export default App;