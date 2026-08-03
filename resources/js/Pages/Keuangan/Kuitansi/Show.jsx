import { Head, usePage } from '@inertiajs/react';
import { GraduationCap, Printer } from 'lucide-react';
import { formatNumber } from '@/utils/formatRupiah';

export default function KuitansiShow({ pembayaran, profilSekolah, terbilang }) {
    const { sekolah } = usePage().props;

    // Memastikan format tanggal Indonesia
    const formatTanggal = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Fungsi untuk mendapatkan nama bendahara/penerima
    const namaBendahara = pembayaran.user?.name || 'Bendahara Sekolah';

    // Fallback data yayasan jika profil belum lengkap
    const namaYayasan = profilSekolah?.nama_sekolah || 'YAYASAN PENDIDIKAN';
    const alamatYayasan = profilSekolah?.alamat || 'Alamat Yayasan/Sekolah';
    const kontakYayasan = `Telp: ${profilSekolah?.telepon || '-'} | Email: ${profilSekolah?.email || '-'}`;

    // Memetakan struktur detail pembayaran menjadi daftar items
    const items = pembayaran.detail_pembayarans?.map((detail, index) => ({
        no: index + 1,
        nama: detail.tagihan?.kategori_tagihan?.nama_kategori || 'Pembayaran Lain',
        jumlah: detail.nominal_bayar
    })) || [];

    // Fallback nama tahun ajaran dari kelas siswa jika memungkinkan, 
    // jika tidak, ambil tahun berjalan
    const currentYear = new Date(pembayaran.tanggal_bayar).getFullYear();
    const tahunAjaran = `${currentYear}/${currentYear + 1}`;

    return (
        <>
            <Head title={`Kuitansi ${pembayaran.no_referensi}`} />

            {/* Print button */}
            <div className="print:hidden max-w-4xl mx-auto p-6">
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-blue-700 transition-all mb-6"
                >
                    <Printer className="w-4 h-4" /> Cetak Kuitansi
                </button>
            </div>

            {/* A5 Landscape Container */}
            <div
                className="bg-white mx-auto print:m-0 print:p-0 shadow-sm print:shadow-none font-sans"
                style={{
                    width: '210mm',
                    minHeight: '148mm',
                    padding: '8mm',
                    boxSizing: 'border-box'
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center shrink-0 grayscale !opacity-100 filter contrast-125 mix-blend-multiply">
                            {sekolah?.logo_url ? (
                                <img src={sekolah.logo_url} alt="Logo Yayasan" className="w-full h-full object-contain grayscale" style={{ filter: 'grayscale(100%)' }} />
                            ) : (
                                <img src="/images/logoppl.png" alt="Logo Yayasan" className="w-full h-full object-contain grayscale" style={{ filter: 'grayscale(100%)' }} />
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#0F172A] tracking-wide mb-0.5 uppercase">{namaYayasan}</h1>
                            <p className="text-[#64748B] text-xs mb-0.5">{alamatYayasan}</p>
                            <p className="text-[#64748B] text-xs">{kontakYayasan}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-[#0F172A] tracking-wide mb-2">KWITANSI PEMBAYARAN</h2>
                        <table className="ml-auto text-xs">
                            <tbody>
                                <tr>
                                    <td className="text-[#64748B] pr-4 text-right">No. Transaksi</td>
                                    <td className="font-bold text-[#0F172A]">:{' '}{pembayaran.no_referensi}</td>
                                </tr>
                                <tr>
                                    <td className="text-[#64748B] pr-4 text-right">Tanggal</td>
                                    <td className="font-bold text-[#0F172A]">:{' '}{formatTanggal(pembayaran.tanggal_bayar)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Divider Double Line */}
                <div className="border-t-[1px] border-b-[2px] border-[#0F172A] py-[1px] mb-3"></div>

                {/* Student Info */}
                <div className="flex justify-between text-xs mb-3 px-1">
                    <div className="flex gap-6">
                        <div className="flex">
                            <span className="text-[#64748B] w-12">Nama</span>
                            <span className="font-bold text-[#0F172A]">:{' '}{pembayaran.siswa?.nama_lengkap || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="text-[#64748B] w-10">Kelas</span>
                            <span className="font-bold text-[#0F172A]">:{' '}{pembayaran.siswa?.kelas?.nama_kelas || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="text-[#64748B] w-10">NISN</span>
                            <span className="font-bold text-[#0F172A]">:{' '}{pembayaran.siswa?.nisn || '-'}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <span className="text-[#64748B] mr-2">Tahun Ajaran</span>
                        <span className="font-bold text-[#0F172A]">:{' '}{tahunAjaran}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-[#E2E8F0] rounded-lg overflow-hidden mb-3">
                    <table className="w-full text-xs">
                        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <tr>
                                <th className="py-2 px-3 text-center font-semibold text-[#334155] w-12 border-r border-[#E2E8F0]">No</th>
                                <th className="py-2 px-3 text-left font-semibold text-[#334155] border-r border-[#E2E8F0]">Item Pembayaran</th>
                                <th className="py-2 px-3 text-right font-semibold text-[#334155] w-40">Jumlah (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map((item, index) => (
                                <tr key={index} className="border-b border-[#E2E8F0] last:border-0">
                                    <td className="py-1.5 px-3 text-center text-[#475569] border-r border-[#E2E8F0]">{item.no}</td>
                                    <td className="py-1.5 px-3 text-[#475569] border-r border-[#E2E8F0]">{item.nama}</td>
                                    <td className="py-1.5 px-3 text-right text-[#475569]">{formatNumber(item.jumlah)}</td>
                                </tr>
                            )) : (
                                <tr className="border-b border-[#E2E8F0]">
                                    <td colSpan="3" className="py-2 px-3 text-center text-[#475569]">Data item pembayaran tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
                            <tr>
                                <td colSpan="2" className="py-2 px-3 text-right font-bold text-[#334155] border-r border-[#E2E8F0]">GRAND TOTAL</td>
                                <td className="py-2 px-3 text-right font-bold text-[#0F172A] text-sm">Rp {formatNumber(pembayaran.total_bayar)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer Section: Terbilang & Signature */}
                <div className="flex justify-between items-start mt-2">
                    {/* Terbilang Box */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 w-[60%]">
                        <p className="text-[10px] text-[#64748B] mb-1.5 uppercase tracking-wider">TERBILANG:</p>
                        <p className="font-bold text-[#0F172A] italic text-sm">"{terbilang}"</p>
                    </div>

                    {/* Signature */}
                    <div className="w-48 text-center pt-1">
                        <p className="text-xs text-[#64748B] mb-14">Bendahara</p>
                        <div className="border-b border-[#94A3B8] mb-1 mx-2"></div>
                        <p className="text-xs font-medium text-[#475569]">{namaBendahara}</p>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-3 text-center">
                    <p className="text-[10px] text-[#94A3B8] italic">
                        * Dokumen ini sah tanpa tanda tangan basah jika dicetak secara sistem. Harap simpan sebagai bukti yang sah.
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        size: A5 landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background-color: white !important;
                    }
                    body * { 
                        visibility: hidden; 
                    }
                    .print\\:hidden { 
                        display: none !important; 
                    }
                    .bg-white.mx-auto,
                    .bg-white.mx-auto * { 
                        visibility: visible; 
                    }
                    .bg-white.mx-auto {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 210mm;
                        padding: 8mm;
                        margin: 0;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}

