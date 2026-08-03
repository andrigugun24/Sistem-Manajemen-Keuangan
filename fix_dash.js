const fs = require('fs');

function fixKepalaSekolah() {
    let file = 'resources/js/Pages/Dashboard/KepalaSekolahDashboard.jsx';
    let content = fs.readFileSync(file, 'utf8');

    // 1. Props
    content = content.replace(
        'const { stats = {}, auth } = usePage().props;',
        'const { stats = {}, auth, monthlyData = [], bosData = {}, kapasitasData = [] } = usePage().props;'
    );

    // 2. BOS Data using regex replacement to be safe against formatting
    let bosRegex = /<div className="flex items-center gap-3">[\s\S]*?Q1[\s\S]*?Total Diterima[\s\S]*?Dana BOS Tahap 1[\s\S]*?<\/div>[\s\S]*?<span className="text-sm font-bold text-slate-900 dark:text-white">Rp 245\.000\.000<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="w-full h-px bg-slate-100"><\/div>[\s\S]*?<div className="flex justify-between items-center">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?-[\s\S]*?Terpakai[\s\S]*?Sesuai RKAS[\s\S]*?<\/div>[\s\S]*?<span className="text-sm font-bold text-slate-900 dark:text-white">Rp 198\.000\.000<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="w-full h-px bg-slate-100"><\/div>[\s\S]*?<div className="flex justify-between items-center">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?=[\s\S]*?Sisa Anggaran[\s\S]*?Bisa dialihkan[\s\S]*?<\/div>[\s\S]*?<span className="text-sm font-bold text-emerald-600">Rp 47\.000\.000<\/span>[\s\S]*?<\/div>/;

    let bosNew = `<div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs text-center border border-slate-100 dark:border-slate-800">IN</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Total Diterima</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Dana Masuk BOS (Tahun Ini)</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatRp(bosData?.totalDiterima || 0)}</span>
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center font-bold text-orange-500 text-xs border border-orange-100">-</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Terpakai</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Dana Keluar BOS (Tahun Ini)</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatRp(bosData?.terpakai || 0)}</span>
                            </div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-emerald-500 text-xs border border-emerald-100">=</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Sisa Anggaran</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Saldo Akhir BOS</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">{formatRp(bosData?.sisa || 0)}</span>
                            </div>`;
    content = content.replace(bosRegex, bosNew);

    // 3. Kelas Data
    let classRegex = /\{\['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4'\]\.map\(\(kelas, i\) => \([\s\S]*?\}\)\)\}/;
    let classNew = `{kapasitasData.length === 0 ? (
                                <p className="text-sm text-slate-500">Belum ada data siswa.</p>
                            ) : (
                                kapasitasData.map((kelas, i) => {
                                    const maxCapacity = Math.max(...kapasitasData.map(k => k.jumlah), 40);
                                    const percent = Math.min((kelas.jumlah / maxCapacity) * 100, 100);
                                    return (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 w-16 truncate" title={kelas.nama}>{kelas.nama}</span>
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-[6px] overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: \`\${percent}%\` }}
                                                ></div>
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 w-14 text-right">{kelas.jumlah} org</span>
                                        </div>
                                    );
                                })
                            )}`;
    content = content.replace(classRegex, classNew);

    fs.writeFileSync(file, content);
    console.log('KepalaSekolahDashboard updated');
}

function fixKepalaYayasan() {
    let file = 'resources/js/Pages/Dashboard/KepalaYayasanDashboard.jsx';
    let content = fs.readFileSync(file, 'utf8');

    // 1. Props
    content = content.replace(
        'const { stats = {} } = usePage().props;',
        'const { stats = {}, fundDistribution = [], performaUnit = [] } = usePage().props;'
    );

    // 2. Remove hardcoded array fundDistribution at top
    let fundTopRegex = /const fundDistribution = \([\s\S]*?\];\n\n/;
    content = content.replace(/const fundDistribution = \[\s*\{ name: 'Dana BOS'[\s\S]*?\}\s*\];/, '');

    // 3. Replace Data in Pie chart to use fundDistribution only if not empty
    let pieRegex = /<PieChart>[\s\S]*?<\/PieChart>/;
    let pieNew = `<PieChart>
                                {fundDistribution.length > 0 ? (
                                    <Pie
                                        data={fundDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {fundDistribution.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                ) : null}
                                <Tooltip formatter={(v) => \`\${v}%\`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                <Legend />
                            </PieChart>`;
    content = content.replace(pieRegex, pieNew);

    // 4. Performa Per Unit
    let perfRegex = /\{\[\s*\{\s*unit: 'SD Yayasan'[\s\S]*?\}\)\)\}/;
    let perfNew = `{performaUnit.length === 0 ? (
                                <div className="text-sm text-slate-500 text-center py-4">Belum ada data unit</div>
                            ) : (
                                performaUnit.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">{item.unit}</h4>
                                        <span className={\`text-xs px-2 py-1 rounded-full font-medium \${item.progress >= 80 ? 'bg-emerald-100 text-emerald-700' : (item.progress >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}
                                            \`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-400 dark:text-slate-500">Siswa Aktif</span>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{item.siswa}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 dark:text-slate-500">Pemasukan P/T</span>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{formatRp(item.pemasukan)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 dark:text-slate-500">Realisasi Pemasukan SSP & Tagihan</span>
                                            <span className="font-medium text-slate-600 dark:text-slate-400">{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div
                                                className={\`h-2 rounded-full transition-all duration-500 \${item.progress >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : (item.progress >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400')}\`}
                                                style={{ width: \`\${Math.min(item.progress, 100)}%\` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )))}`;
    content = content.replace(perfRegex, perfNew);

    fs.writeFileSync(file, content);
    console.log('KepalaYayasanDashboard updated');
}

fixKepalaSekolah();
fixKepalaYayasan();
