import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { formatRp, formatNumber } from '@/utils/formatRupiah';
import { ChevronLeft, Pencil, Trash2, Calendar, FileText, Printer } from 'lucide-react';
import { confirmDelete } from '@/utils/confirmDelete';

export default function TagihanShow() {
    const { siswa, tagihans, auth } = usePage().props;
    const canEdit = ['admin', 'bendahara'].includes(auth?.user?.role);

    const handleDelete = (id) => {
        confirmDelete(() => {
            router.delete(route('tagihan.destroy', id));
        }, 'Apakah Anda yakin ingin menghapus tagihan ini?');
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Tagihan - ${siswa.nama_lengkap}`} />
            <div className="max-w-[1200px] mx-auto pb-10">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('tagihan.index')} className="p-2 bg-white rounded-full hover:bg-slate-50 transition-colors shadow-sm border border-slate-200">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Riwayat Tagihan</h2>
                            <p className="text-sm text-slate-500">{siswa.nama_lengkap} - Kelas {siswa.kelas?.nama_kelas} ({siswa.nisn})</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Kategori & Bulan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nominal</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Sisa Tagihan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Jatuh Tempo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                                {canEdit && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tagihans.data.length > 0 ? tagihans.data.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{t.kategori_tagihan?.nama_kategori}</div>
                                        <div className="text-xs text-slate-500">{t.bulan_tagihan || 'Sekali Bayar'} &bull; {t.tahun_ajaran?.nama_tahun_ajaran}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">Rp {formatNumber(t.nominal_tagihan)}</td>
                                    <td className="px-6 py-4 font-medium text-rose-600">Rp {formatNumber(t.sisa_tagihan)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {t.jatuh_tempo && t.jatuh_tempo.includes('2099') ? 'Tidak Ada Batas Waktu' : new Date(t.jatuh_tempo).toLocaleDateString('id-ID')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${t.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' :
                                                t.status === 'sebagian' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                            }`}>
                                            {t.status === 'sebagian' ? 'SEBAGIAN' : t.status.toUpperCase().replace('_', ' ')}
                                        </span>
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {t.status === 'lunas' && t.detail_pembayarans?.[0]?.pembayaran?.id && (
                                                    <a href={route('kuitansi.show', t.detail_pembayarans[0].pembayaran.id)} target="_blank" rel="noreferrer" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Cetak Kuitansi">
                                                        <Printer className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <Link href={route('tagihan.edit', t.id)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Tagihan">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Tagihan">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={canEdit ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-12 h-12 text-slate-300 mb-3" />
                                            <p className="font-semibold text-slate-600">Belum ada tagihan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
